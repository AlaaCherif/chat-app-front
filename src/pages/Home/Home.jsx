import { Button, Paper, TextField } from "@mui/material";
import jwtDecode from "jwt-decode";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import { LogOutOutline, SwapHorizontalOutline } from "react-ionicons";
import Message from "../../components/Message";
import {
  createCsr,
  decrypt,
  encrypt,
  genKeys,
  getPublicKey,
} from "../../services/crypto.service";
import classes from "./Home.module.css";

export default function Home() {
  const bottomRef = useRef();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState();
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState();
  const reset = () => {
    setEmail("");
    setMessages([]);
    setPublicKey();
  };
  const fetchPublicKey = () => {
    getPublicKey(email)
      .then((res) => {
        setPublicKey(res.data);
      })
      .catch((err) => {
        toast.error("This user doesn't exist");
        console.log(err.response.data);
      });
  };

  const emitMessage = () => {
    const toSend = JSON.stringify({
      user: email,
      data: encrypt(message, publicKey),
    });
    setMessages((prev) => [...prev, { message, sent: true }]);
    socket.emit("data", toSend);
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    setUser(jwtDecode(token));
    genKeys();
  }, []);
  useEffect(() => {
    const socket = io("localhost:5001/", {
      auth: {
        token: localStorage.getItem("token"),
        csr: createCsr(jwtDecode(localStorage.getItem("token")).user),
      },
      transports: ["websocket"],
      cors: {
        origin: "http://localhost:3000/",
      },
    });
    setSocket(socket);
    socket.on("connect", (data) => {
      toast.success(
        `Welcome Home ${jwtDecode(localStorage.getItem("token")).user}`
      );
    });

    socket.on("disconnect", (data) => {
      console.log(data);
    });
    socket.on("data", (data) => {
      setMessages((prev) => [
        ...prev,
        { message: decrypt(data.data), sent: false },
      ]);
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    });
    return function cleanup() {
      socket.disconnect();
    };
  }, []);

  return (
    <Paper
      style={{ display: "flex", flexDirection: "column" }}
      className={classes.container}
    >
      <Button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        <div className={classes.actionContainer}>
          <LogOutOutline color={"#00000"} height="30px" width="30px" /> Logout
        </div>
      </Button>
      {publicKey ? (
        <>
          <h2>Talking to {email}</h2>
          <Button onClick={reset}>
            <div className={classes.actionContainer}>
              <SwapHorizontalOutline
                color="#1976d2"
                height="30px"
                width="30px"
              />{" "}
              Talk to someone else
            </div>
          </Button>
        </>
      ) : (
        <>
          <h2>Welcome,</h2>
          <h2>{user && user.user}</h2>
          <h2>Start a conversation !</h2>
          <h3>Type your friend's email</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchPublicKey();
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <TextField
                label="email"
                palceholder="friend@email.insat"
                variant="filled"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" color="secondary">
                Chat !
              </Button>
            </div>
          </form>
        </>
      )}
      {publicKey && (
        <div className={classes.messageContainer}>
          {messages &&
            messages.length > 0 &&
            messages.map((item) => (
              <Message key={Math.random()} message={item} />
            ))}
          <div ref={bottomRef}></div>
        </div>
      )}

      {publicKey && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            emitMessage();
            setMessage("");
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              label="Message"
              palceholder="friend@email.insat"
              variant="filled"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" color="secondary">
              Send Message
            </Button>
          </div>
        </form>
      )}
      <ToastContainer theme="dark" />
    </Paper>
  );
}
