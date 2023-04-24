import React from "react";
import { useState, useRef, useEffect } from "react";
import { Col, Button, Modal, Form, Card, ListGroup } from "react-bootstrap";
import { supabase } from "../lib/api";
import Subpod from "./subpod";
import { FaSyncAlt } from "react-icons/fa";

export default function Bankpod({ setLoading, bankPod, setPods, pods }) {
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [showAddModal, setAddModal] = useState(false);
  const [showSubtractModal, setSubtractModal] = useState(false);
  const [showSubModal, setSubModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [subtractAmount, setSubtractAmount] = useState("");
  const [subPods, setSubPods] = useState([]);
  const [subName, setSubName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the bankpods and subpods data
      const { data, error } = await supabase
        .from("SubPods")
        .select()
        .eq("bankpod_id", bankPod.id)
        .order("created_at", { ascending: true });
      setSubPods(data);
    };
    fetchData();
  }, []);

  function toggleDeleteModal() {
    setDeleteModal(!showDeleteModal);
  }

  function toggleAddModal() {
    setAddModal(!showAddModal);
  }

  function toggleSubtractModal() {
    setSubtractModal(!showSubtractModal);
  }

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const deletePod = async () => {
    setLoading(true);
    // Delete all SubPods that reference this BankPod
    const { error: subPodError } = await supabase
      .from("SubPods")
      .delete()
      .eq("bankpod_id", bankPod.id)
      .select();

    if (subPodError) {
      console.error("Error deleting SubPods: ", subPodError);
      return;
    }
    setSubPods([]);

    // Delete the BankPod itself
    const { data, error: bankPodError } = await supabase
      .from("BankPods")
      .delete()
      .eq("id", bankPod.id)
      .select();

    if (bankPodError) {
      console.error("Error deleting BankPod: ", bankPodError);
      return;
    }

    console.log("Successfully deleted BankPod: ", data);
    setPods(pods.filter((pod1) => pod1.id !== bankPod.id));
    setLoading(false);
    toggleDeleteModal();
  };

  const updateAccountTotal = async (podId, newBalance) => {
    const { data, error } = await supabase
      .from("BankPods")
      .update({ accountTotal: newBalance })
      .eq("id", podId)
      .select();

    if (error) {
      console.error("Error updating bankpod: ", error);
      return null;
    }

    console.log("Successfully updated bankpod: ", data[0]);
    return data[0];
  };

  const updatePodBalance = async (podId, newBalance) => {
    const { data, error } = await supabase
      .from("BankPods")
      .update({ balance: newBalance })
      .eq("id", podId)
      .select();

    if (error) {
      console.error("Error updating bankpod: ", error);
      return null;
    }

    console.log("Successfully updated bankpod: ", data[0]);
    return data[0];
  };

  const newTotal = async (event) => {
    event.preventDefault();
    const currentBalance = Number(bankPod.balance);

    // Get all the subpods associated with this bankpod
    const { data: subpods, error } = await supabase
      .from("SubPods")
      .select("balance")
      .eq("bankpod_id", bankPod.id)
      .select();

    if (error) {
      console.error("Error fetching subpods: ", error);
      return;
    }

    // Calculate the sum of all subpod balances
    const subTotal = subpods.reduce(
      (total, subpod) => total + Number(subpod.balance),
      0
    );

    // Calculate the new total and available balance
    const newTotal = Number(addAmount);
    const newAvailable = newTotal - subTotal;

    // Update the bankpod's accountTotal and balance in the database
    const updatedAccountTotal = await updateAccountTotal(bankPod.id, newTotal);
    const updatedPodBalance = await updatePodBalance(bankPod.id, newAvailable);

    // Update the pods state with the updated data
    if (updatedAccountTotal && updatedPodBalance) {
      setPods(
        pods.map((pod) => {
          if (pod.id === bankPod.id) {
            return {
              ...pod,
              accountTotal: updatedAccountTotal.accountTotal,
              balance: updatedPodBalance.balance,
            };
          }
          return pod;
        })
      );
    }

    setAddModal(false);
    setAddAmount("");
  };

  const addMoney = async (event) => {
    event.preventDefault();
    const currentBalance = Number(bankPod.balance);
    const newBalance = currentBalance + Number(addAmount);
    updatePodBalance(bankPod.id, newBalance);
    setAddModal(false);
    setAddAmount("");
  };

  const subtractMoney = async (event) => {
    event.preventDefault();
    const currentBalance = Number(bankPod.balance);
    const newBalance = currentBalance - Number(subtractAmount);
    updatePodBalance(bankPod.id, newBalance);
    setSubtractModal(false);
    setSubtractAmount("");
  };

  const addSubpod = async (event) => {
    event.preventDefault();
    const { data, error } = await supabase
      .from("SubPods")
      .insert([{ podname: subName, balance: 0, bankpod_id: bankPod.id }])
      .select();
    if (error) {
      console.error("Error adding subpod: ", error);
    } else {
      console.log("Successfully added subpod: ", data);
      setSubPods([...subPods, data[0]]);
    }
    setSubModal(false);
    setSubName("");
  };

  return (
    <Col
      xs={3}
      className="mx-auto pb-4"
      style={{ height: "100%", minWidth: "350px", maxWidth: "400px" }}
    >
      <Card style={{ width: "100%", background: "#d8a1e2" }}>
        <Card.Body>
          <Card className={subPods.length > 0 ? "p-3 mb-3" : "p-3"}>
            <div className="d-flex flex-column justify-content-between">
              <div className="d-flex justify-content-between">
                <Card.Title>{capitalize(bankPod.bankName)}</Card.Title>
                <Button
                  onClick={toggleDeleteModal}
                  variant="outline-danger"
                  size="sm"
                  style={{
                    padding: "2px",
                    height: "20px",
                    width: "20px",
                    textAlign: "center",
                    display: "flex",
                  }}
                >
                  <i
                    className="fa fa-times"
                    aria-hidden="true"
                    style={{ margin: "auto", paddingTop: ".5px" }}
                  ></i>
                </Button>
              </div>
              <h6 style={{ marginTop: "8px" }}>Total:</h6>
              <div
                className="d-flex justify-content-between"
                style={{ alignItems: "center" }}
              >
                <h4>
                  $
                  {bankPod.accountTotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginLeft: "auto",
                  }}
                >
                  <Button
                    variant="secondary"
                    style={{
                      height: "25px",
                      marginBottom: "10px",
                      paddingBottom: "20px",
                    }}
                    onClick={toggleAddModal}
                  >
                    <FaSyncAlt
                      style={{
                        height: "15px",
                        width: "15px",
                        marginBottom: "20px",
                      }}
                    />
                  </Button>
                </div>
              </div>
              <h6 style={{ marginTop: "8px" }}>Available:</h6>
              <div
                className="d-flex justify-content-between"
                style={{ alignItems: "center" }}
              >
                <h4>
                  $
                  {bankPod.balance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </h4>
              </div>
            </div>
          </Card>
          <ListGroup className="list-group-flush">
            {subPods.map((subPod) => (
              <Subpod
                updatePodBalance={updatePodBalance}
                pods={pods}
                setPods={setPods}
                bankPod={bankPod}
                subPod={subPod}
                subPods={subPods}
                setSubPods={setSubPods}
              />
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
      <ListGroup className="list-group-flush mt-2">
        <Button variant="primary" onClick={() => setSubModal(true)}>
          Add Subpod
        </Button>
      </ListGroup>
      <Modal show={showDeleteModal} onHide={toggleDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Bankpod</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this bankpod?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deletePod(bankPod.id)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAddModal} onHide={() => setAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{bankPod.bankName}: Update Total Balance </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={newTotal}>
            <Form.Group>
              <Form.Label>Amount:</Form.Label>
              <Form.Control
                pattern="^[0-9]*(\.[0-9]{0,2})?$"
                type="text"
                value={addAmount}
                onChange={(event) => setAddAmount(event.target.value)}
                placeholder="Enter dollar amount"
                required
              />
            </Form.Group>
            <div style={{ marginTop: "15px" }}>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal show={showSubModal} onHide={() => setSubModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Subpod</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={addSubpod}>
            <Form.Group>
              <Form.Label>Subpod Name</Form.Label>
              <Form.Control
                type="text"
                value={subName}
                onChange={(event) => setSubName(event.target.value)}
                placeholder="Enter bank name"
                required
              />
            </Form.Group>
            <div style={{ marginTop: "15px" }}>
              <Button variant="primary" type="submit">
                Add
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Col>
  );
}
