import React, { useContext, useEffect, useState } from "react";
import FormInput from "../Components/CommonConponents/FormInput/FormInput";
import { Button } from "@mui/material";
import Cookies from 'js-cookie';


import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API, urlRoot } from "../constant";
import CommonHeader from "../Components/CommonConponents/CommonHeader/CommonHeader";
import { Person } from "@mui/icons-material";
import FullLoading from "../Components/CommonConponents/FullLoading/FullLoading";
import Error404Page from "./ErrorPage/404Page";
import { AuthContext } from "../AppContext/AuthProvider";
import PartialLoading from "../Components/CommonConponents/PartialLoading/PartialLoading";
// import { FormInput } from 'component-lib'





const LoginPage = () => {
    const [username, setUsername] = useState('chiehyu');
    const [password, setPassword] = useState('123');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const { setToken, setIsLogin } = useContext(AuthContext);

    const navigate = useNavigate();

    const fetchLogAuth = useMutation({
        mutationFn: () => {
            return axios.post(`${urlRoot}${API.login}`, {
                username: username,
                password: password,
            })
        },
        onSuccess: (result) => {
            console.log('onSuccess', result.data);
            if (result.data.success && result.data.user.token) {
                setToken(result.data.user.token);
                if (result.data.user.token) {
                    Cookies.set('token', result.data.user.token);
                    setIsLogin(true);
                    navigate('/');
                } else {
                    Cookies.remove('token');
                }
            }
            else {
                Cookies.remove('token');
                setUsernameMessage('帳號或密碼錯誤');
            }
        },
        onError: (error) => {
            console.log(error);
            setUsernameMessage('連線錯誤');
        }
    })

    const hadleClickLogin = () => {
        console.log('click');
        if (username === '') {
            setUsernameMessage('請輸入帳號');
            return;
        }
        if (password === '') {
            setPasswordMessage('請輸入密碼');
            return;
        }
        fetchLogAuth.mutate()
    }
    // if (fetchLogAuth.isLoading) return <FullLoading />;
    if (fetchLogAuth.error) return <Error404Page />

    return (
        <div style={{ width: "100%", height: '100vh', backgroundColor: "#E1F5FE", paddingTop: '70px' }}>
            <div style={{
                margin: '0px auto',
                width: 400,
                height: 550,
                display: 'flex',
                flexWrap: 'wrap',
                padding: 20,
                justifyContent: 'center',
                // border: '1px solid black',

            }}>
                <div style={{ width: '100%', textAlign: 'center', fontSize: "50px", fontWeight: "bolder", color: "#2196F3" }}>eDetector</div>
                <p style={{ width: '100%', textAlign: 'center', fontSize: "30px", fontWeight: "bolder" }}>登入</p>
                <div style={{ width: '100%', height: 100 }}>
                    <FormInput isPassword={false}
                        handleChangeFunction={(e) => {
                            setUsernameMessage('')
                            setUsername(e.target.value)
                        }}
                        title="帳號"
                        fullwidth={true}
                    />
                    <p style={{ margin: '15px 0px 0px 10px', color: '#D32F2F' }}>{usernameMessage}</p>
                </div>
                <div style={{ width: '100%', height: 100 }}>
                    <FormInput
                        isPassword={true}
                        handleChangeFunction={(e) => {
                            setPasswordMessage('')
                            setPassword(e.target.value)
                        }}
                        title="密碼"
                    />
                    <p style={{ margin: '15px 0px 0px 10px', color: '#D32F2F' }}>{passwordMessage}</p>
                </div>
                {fetchLogAuth.isLoading ?
                    <PartialLoading /> :
                    <Button sx={{ width: '100%', backgroundColor: '#2196F3', height: 40, marginTop: 8 }} startIcon={<Person />} variant="contained" onClick={hadleClickLogin}>登入</Button>
                }
            </div>
        </div>
    )
};

export default LoginPage;
