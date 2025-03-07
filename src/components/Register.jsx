import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#ffffff",
                minWidth: "100vw"
            }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3, width: 400, bgcolor: "#ffffff", color: "black", textAlign: "center" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom color="black">
                    Register
                </Typography>

                <Formik
                    initialValues={{ name: "", email: "", password: "" }}
                    validationSchema={Yup.object({
                        name: Yup.string().min(2, "Too Short!").required("Required"), // ✅ Fixed field name
                        email: Yup.string().email("Invalid email").required("Required"),
                        password: Yup.string().min(3, "Must be 3 characters or more").required("Required"),
                    })}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            setSubmitting(true);
                            const response = await axios.post("http://localhost:3000/api/auth/register", values);
                            if (response.data) {
                                toast.success("Registration Successful!");
                                setTimeout(() => navigate("/login"), 2000);
                            }
                        } catch (error) {
                            toast.error(error.response?.data?.message || "Registration Failed! Try again.");
                        } finally {
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Box sx={{ mb: 3 }}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Name"
                                    variant="outlined"
                                    name="name"
                                    InputProps={{ style: { color: "black" } }}
                                    sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
                                />
                                <ErrorMessage name="name" component="div" style={{ color: "red", fontSize: "14px", marginTop: "5px" }} />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    InputProps={{ style: { color: "black" } }}
                                    sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
                                />
                                <ErrorMessage name="email" component="div" style={{ color: "red", fontSize: "14px", marginTop: "5px" }} />
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                <Field
                                    as={TextField}
                                    fullWidth
                                    label="Password"
                                    variant="outlined"
                                    type="password"
                                    name="password"
                                    InputProps={{ style: { color: "black" } }}
                                    sx={{ bgcolor: "#ffffff", borderRadius: 1 }}
                                />
                                <ErrorMessage name="password" component="div" style={{ color: "red", fontSize: "14px", marginTop: "5px" }} />
                            </Box>

                            {/* Submit Button with Loading Indicator */}
                            <Button fullWidth variant="contained" color="primary" type="submit" disabled={isSubmitting} sx={{ mt: 2 }}>
                                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Register"}
                            </Button>

                            {/* Login Button */}
                            <Button fullWidth variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={() => navigate("/login")}>
                                Already have an account? Login
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </motion.div>
    );
};

export default Register;
