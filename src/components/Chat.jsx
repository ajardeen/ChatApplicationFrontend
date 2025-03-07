import { useEffect, useState } from "react";
import {
  Avatar,
  List,
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
import socket from "../socket";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [showUserList, setShowUserList] = useState(!isMobile);

  const senderId = localStorage.getItem("userId");
  const senderName = localStorage.getItem("name");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/auth/getAllUsers")
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Error fetching users:", error));

    socket.on("receiveMessage", (data) => {
      console.log("Message received:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (receiverId) {
      axios
        .get(`http://localhost:3000/api/chat/${senderId}/${receiverId}`)
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
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: "#f0f2f5",
        width: "100vw",
        position: "relative",
        flexDirection: isMobile ? "column" : "row",
        justifySelf:"center"
      }}
    >
      {/* Left Sidebar - User List */}
      {(showUserList || !receiverId) && (
        <Paper
          elevation={3}
          sx={{
            width: isMobile ? "100%" : "25rem",
            height: isMobile ? "calc(100vh - 60px)" : "100vh",
            p: 2,
            display: "flex",
            flexDirection: "column",
           
            position: isMobile ? "absolute" : "relative",
            zIndex: 1,
            backgroundColor: "white",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 2,
              bgcolor: "#1976d2",
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Chat Room</Typography>
          </Paper>

          <TextField
            fullWidth
            placeholder="Search users..."
            variant="outlined"
            sx={{ mb: 2, mt: 2 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {users
            .filter(
              (user) =>
                user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                user._id !== senderId
            )
            .map((user) => (
              <motion.div
                key={user._id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setReceiverId(user._id)}
                style={{ cursor: "pointer", marginBottom: 8 }}
              >
                <ListItem
                  sx={{
                    bgcolor: receiverId === user._id ? "#d1e7fd" : "white",
                    borderRadius: 1,
                    transition: "0.3s",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>{user.username.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={user.username} />
                </ListItem>
              </motion.div>
            ))}

          <Paper
            elevation={2}
            sx={{
              mt: "auto",
              width: "100%",
              p: 2,
              bgcolor: "#1976d2",
              color: "white",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
              <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                Logged in as: {senderName}
              </Typography>
              <Button variant="contained" color="error" onClick={handleLogout} size="small">
                Logout
              </Button>
            </Box>
          </Paper>
        </Paper>
      )}

      {/* Right Chat Section */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          borderLeft: isMobile ? "none" : "1px solid #ddd",
          minWidth: "30rem",
        }}
      >
        {/* Chat Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 2, 
            bgcolor: "#1976d2", 
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {isMobile && receiverId && (
            <Button 
              variant="contained" 
              color="inherit" 
              size="small"
              onClick={() => setShowUserList(true)}
            >
              Back
            </Button>
          )}
          <Typography variant="h6">
            {receiverId
              ? users.find((user) => user._id === receiverId)?.username
              : "Select a user"}
          </Typography>
        </Paper>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender === senderId ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <Paper
                sx={{
                  p: 1,
                  maxWidth: isMobile ? "80%" : "60%",
                  bgcolor: msg.sender === senderId ? "#25d366" : "#ffffff",
                  color: msg.sender === senderId ? "white" : "black",
                  borderRadius: "10px",
                  wordBreak: "break-word",
                }}
              >
                <Typography>{msg.message}</Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", textAlign: "right", mt: 0.5 }}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>

        {/* Message Input */}
        {receiverId && (
          <Box sx={{ display: "flex", p: 2, borderTop: "1px solid #ddd" }}>
            <TextField
              fullWidth
              placeholder="Type a message..."
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              size={isMobile ? "small" : "medium"}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ ml: 1 }}
              onClick={sendMessage}
              size={isMobile ? "small" : "medium"}
            >
              Send
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chat;