import { Formik, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Box, Button, TextField, Typography, Paper, CircularProgress, Backdrop } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GoogleLoginButton from "./GoogleLoginButton";

const Login = () => {
    const navigate = useNavigate();
  
   

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#fff", minWidth: "100vw" }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: 400, bgcolor: "#fff", color: "black", textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Login
                </Typography>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={Yup.object({
                        email: Yup.string().email("Invalid email").required("Required"),
                        password: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, values);
                            const decodedToken = jwtDecode(data.token);
                            localStorage.setItem("token", data.token);
                            localStorage.setItem("userId", decodedToken.id);
                            localStorage.setItem("name", decodedToken.name);
                            toast.success("Login Successful!");
                            setTimeout(() => navigate("/chat"), 1000);
                        } catch (error) {
                            toast.error("Login Failed! Invalid credentials.");
                        }
                        setSubmitting(false);
                    }}
                >
                    {({ isSubmitting, handleChange, handleBlur, values }) => (
                        <Form>
                            <Backdrop
                                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={isSubmitting}
                            >
                                <CircularProgress color="inherit" />
                            </Backdrop>
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{ style: { color: "black" } }}
                                    sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                                />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{ style: { color: "black" } }}
                                    sx={{ bgcolor: "#f5f5f5", borderRadius: 1 }}
                                />
                            </Box>

                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={isSubmitting}
                                    sx={{ mt: 2, p: 1.5, fontSize: 16, fontWeight: "bold", bgcolor: "#1976d2", color: "white" }}
                                >
                                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Login"}
                                </Button>
                            </motion.div>

                            {/* Google Login Button */}
                            <Box sx={{ mt: 2 }}>
                                <GoogleLoginButton/>
                            </Box>

                            {/* Register Button */}
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ marginTop: "10px" }}>
                                <Button fullWidth variant="outlined" color="secondary" sx={{ mt: 2, fontSize: 14, fontWeight: "bold" }} onClick={() => navigate("/register")}>
                                    Create an Account
                                </Button>
                            </motion.div>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </motion.div>
    );
};

export default Login;
