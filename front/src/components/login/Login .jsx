import React, { useEffect, useState } from 'react'
import './login.css'
import { GrMail } from 'react-icons/gr'
import { RiLockPasswordFill } from 'react-icons/ri'

// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'

const Login = () => {
    // const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        password: '',
        email: '',
    })

    // const [t, i18n] = useTranslation();
    // const [toggle, setToggle] = React.useState(true);

    // const handleClick = () => {
    //     i18n.changeLanguage(toggle ? 'ar' : 'en')
    //     setToggle(!toggle);
    // };
    // axios.defaults.withCredentials = true

    // const handleLogin = (e) => {
    //     e.preventDefault()
    //     try {
    //         axios.post('http://localhost:5000/login', loginData ,{ withCredentials: true })
    //             .then((res) => {
    //                 console.log(res)
    //                 navigate('/profile')
    //             }).catch((error) => { console.log(error); })

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }


    return (
        <>
            <div className="login">
                <div className="uni-logo">
                    <img src="assets/uni-logo.png" alt="" />
                </div>
                <div className="login-form">
                    
                        <img src="assets/mini-logo.png" alt="" className='mini-logo' />

                        
                            
                                <h2>
                                    تسجيل الدخول
                                </h2>
                          
                            
                                <div className="input-container" style={{ gap: "2rem", }}>
                                    <GrMail className='Icon' style={{ fontSize: "3.5rem" }} />
                                    <input
                                        type="text"
                                        placeholder="ادخل البريد الالكترونى"
                                        className='inputIN'
                                        style={{ cursor: "text", height: "4rem" }}
                                        value={loginData.email} onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}
                                    />
                                </div>
                                <div className="input-container" style={{ gap: "2rem", }}>
                                    <RiLockPasswordFill className='Icon' style={{ fontSize: "3.5rem" }} />
                                    <input
                                        type="password"
                                        placeholder="كلمه المرور"
                                        className='inputIN'
                                        style={{ cursor: "text", height: "4rem" }}
                                        value={loginData.password} onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                                    />
                                </div>
                                <div className="actions">
                                    <button >تسجيل الدخول</button>
                                </div>
                            

                        
                    
                </div>
            </div>
        </>
    )
}

export default Login 