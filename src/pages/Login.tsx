import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom";
import { Manager } from "socket.io-client";
import styled from "styled-components";
import HeaderBar from "../components/HeaderBar";

const Main = styled.div`
  display: flex;
  height: calc(100% - 60px);
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const LoginDiv = styled.div`
  background-image: url("https://iserte.github.io/csgo-b7g/static/media/background-login.a390c1dd.png");
  width: 320px;
  height: 325px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1px solid rgb(153, 153, 153);
`

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams()

  const manager = new Manager(process.env.REACT_APP_IO_HOST!, {
    reconnection: false,
    autoConnect: false
  })

  useEffect(() => {
    const steamid = searchParams.get("steamid")
    if (!steamid) return;

    const socket = manager.socket("/", {
      auth: { steamid }
    })

    socket.connect()

    socket.on("setAccount", (params) => {
      localStorage.setItem(process.env.REACT_APP_LS_ACCOUNTDATA!, JSON.stringify(params))
      socket.disconnect()
      return navigate(0)
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <HeaderBar><h1>B7 Gaming Mix</h1></HeaderBar>

      <Main>
        <h1>Faça login para continuar</h1>
        <LoginDiv>
          <a href={process.env.REACT_APP_BACKEND_AUTH_URL!}>
            <img src="https://steamcdn-a.akamaihd.net/steamcommunity/public/images/steamworks_docs/brazilian/sits_large_noborder.png" alt="Steam Login" />
          </a>
        </LoginDiv>
      </Main>
    </>
  )
}

export default Login;
