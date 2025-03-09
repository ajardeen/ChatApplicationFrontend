import { useEffect, useState } from "react";
import {
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import socket from "../Socket.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [showUserList, setShowUserList] = useState(true);

  const senderId = localStorage.getItem("userId");
  const senderName = localStorage.getItem("name");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/getAllUsers`)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (receiverId) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_CHAT_URL}/${senderId}/${receiverId}`)
        .then((response) => setMessages(response.data))
        .catch((error) => console.error("Error fetching messages:", error));
      if (isMobile) {
        setShowUserList(false);
      }
    }
  }, [receiverId]);

  const sendMessage = () => {
    if (message.trim() !== "" && receiverId) {
      const newMessage = {
        sender: senderId,
        receiver: receiverId,
        message,
        timestamp: new Date(),
      };
      socket.emit("sendMessage", newMessage);
      setMessage("");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100vw", flexDirection: isMobile ? "column" : "row", overflowX: "hidden", bgcolor: "#f0f2f5" }}>
      {/* Left Sidebar - User List */}
      {(showUserList || !receiverId || !isMobile) && (
        <Paper
          elevation={3}
          sx={{ width: isMobile ? "100%" : "20rem", height: "100vh", display: "flex", flexDirection: "column", overflowY: "auto", backgroundColor: "white" }}
        >
          <Typography variant="h6" textAlign="center" p={2} bgcolor="#1976d2" color="white">Chat Room</Typography>

          <TextField fullWidth placeholder="Search users..." variant="outlined" sx={{ mb: 2, mt: 2 }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

          {users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase()) && user._id !== senderId).map(user => (
            <ListItem key={user._id} button sx={{ borderRadius: 1, mb: 1, bgcolor: receiverId === user._id ? "#d1e7fd" : "white" }} onClick={() => setReceiverId(user._id)}>
              <ListItemAvatar>
                <Avatar>{user.username.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.username} />
            </ListItem>
          ))}

          <Box sx={{ mt: "auto", p: 2, textAlign: "center" }}>
            <Typography variant="body1">Logged in as: {senderName}</Typography>
            <Button variant="contained" color="error" onClick={handleLogout} sx={{ mt: 2 }}>Logout</Button>
          </Box>
        </Paper>
      )}

      {/* Right Chat Section */}
      {(!showUserList || !isMobile) && receiverId && (
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", borderLeft: "1px solid #ddd" }}>
          <Paper sx={{ p: 2, bgcolor: "#1976d2", color: "white", display: "flex", alignItems: "center" }}>
            {isMobile && (
              <Button variant="contained" color="secondary" onClick={() => setShowUserList(true)}>Back</Button>
            )}
            <Typography variant="h6" marginLeft={2}>{receiverId ? users.find((user) => user._id === receiverId)?.username : "Select a user"}</Typography>
          </Paper>

          {/* Messages */}
          <Box sx={{ flex: 1, p: 2, overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} style={{ display: "flex", justifyContent: msg.sender === senderId ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                <Paper sx={{ p: 1, maxWidth: "60%", bgcolor: msg.sender === senderId ? "#25d366" : "#ffffff", color: msg.sender === senderId ? "white" : "black", borderRadius: "10px" }}>
                  <Typography>{msg.message}</Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>

          {/* Message Input */}
          {receiverId && (
            <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ddd" }}>
              <TextField fullWidth placeholder="Type a message..." variant="outlined" value={message} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} onChange={(e) => setMessage(e.target.value)} />
              <Button variant="contained" color="primary" onClick={sendMessage} onKeyDown={(e) => e.key === 'Enter' && sendMessage()}>Send</Button>            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Chat;
