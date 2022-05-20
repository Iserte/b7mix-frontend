/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Manager } from "socket.io-client";
import styled from "styled-components";
import DangerButton from "../components/DangerButton";
import HeaderBar from "../components/HeaderBar";
import ProfileCard from "../components/ProfileCard";
import SuccessButton from "../components/SuccessButton";

interface syncDataInterface {
  isMatchRunning?: boolean,
  players?: Array<accountDataInterface>,
  matchData?: matchDataInterface
}

interface accountDataInterface {
  avatar?: string | undefined,
  avatarfull?: string | undefined,
  avatarhash?: string | undefined,
  avatarmedium?: string | undefined,
  commentpermission?: string | undefined,
  communityvisibilitystate?: string | undefined,
  lastlogoff?: string | undefined,
  loccityid?: string | undefined,
  loccountrycode?: string | undefined,
  locstatecode?: string | undefined,
  personaname?: string | undefined,
  personastate?: string | undefined,
  personastateflags?: string | undefined,
  primaryclanid?: string | undefined,
  profilestate?: string | undefined,
  profileurl?: string | undefined,
  steamid: string,
  timecreated?: string | undefined,
}

interface matchDataInterface {
  teamAName: string | undefined,
  teamA: accountDataInterface[],
  teamBName: string | undefined,
  teamB: accountDataInterface[]
}

const Profile = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  & img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  & a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;

    & p {
      font-size: 24px;
      margin: 0 10px;
    }
  }
`

const Queue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  
  & button {
    margin: 0 10px;
  }

  & p {
    font-size: 12px;
    font-weight: bold;
  }
`

const QueueArea = styled.div`
  display: flex;
  flex: 1;
`
const MatchArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100% - 60px);

  & .teamA { border-radius: 12px 0 0 12px}
  & .teamB { border-radius: 0 12px 12px 0}

  & .team, .connect {
    background-color: #223353;
    height: 300px;
  }

  & .team {
    width: 250px;
    padding: 10px;

    & h2 {
      text-align: center;
      border-bottom: 1px solid #112222;
      padding: 10px;
      margin-bottom: 10px;
    }

    & .match-players {
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  & .connect {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 10px;

    & a {
      text-decoration: none;
      color: #fff;
      background-color: #335588;
      padding: 10px;
      border: 1px solid #221144;
      border-radius: 4px;
      margin-bottom: 10px;
    }

    & p {
      font-size: 12px;
    }
  }
`

const MatchPlayer = styled.a`
  display: flex;
  align-items: center;
  /* margin: 4px; */
  color: #fff;
  text-decoration: none;
  border: 1px solid #112222;
  background-color: #5599ff;
  border-radius: 4px;
  padding: 4px;

  & img {
    border-radius: 50%;
    height: 30px;
    width: 30px;
  }

  & p {
      margin: 0 5px;
      font-size: 14px;
      font-weight: bold;
    }
`

const manager = new Manager(process.env.REACT_APP_IO_HOST!, {
  reconnection: true,
  autoConnect: true
})

function Lobby() {
  const [accountData, setAccountData] = useState<accountDataInterface>()
  const [matchData, setMatchData] = useState<matchDataInterface>()
  const [playersData, setPlayersData] = useState<syncDataInterface>({isMatchRunning: false, players: []})

  const navigate = useNavigate();

  const accountDataString = localStorage.getItem(process.env.REACT_APP_LS_ACCOUNTDATA!)
  const steamid = JSON.parse(accountDataString!).steamid

  const socket = manager.socket("/", {
    auth: { steamid }
  })

  socket.on("connect", () => {
    socket.emit("syncPlayers")

    // Sincroniza os jogadores da fila
    socket.on("syncPlayers", (syncData: syncDataInterface) => setPlayersData(syncData))
    socket.on("syncMatch", (syncData: matchDataInterface) => setMatchData(syncData))
  })

  const handleLogout = () => {
    localStorage.clear()
    return navigate(0)
  };

  const enterQueue = () => {
    socket.emit("enterQueue", accountData)
  }

  const leaveQueue = () => {
    socket.emit("leaveQueue", accountData)
    setPlayersData({isMatchRunning: false, players: []})
  }

  useEffect(() => {
    setAccountData(JSON.parse(accountDataString!))
    return navigate("/")
  }, [])

  return (
    <>
      <HeaderBar>
        <Queue>
          <h1>Lobby</h1>
          {
            matchData ?
            <p style={{margin: "0 1rem"}}>Ha uma partida em andamento</p>
            :
            playersData.players!.find(p => p.steamid === accountData!.steamid) ?
              <DangerButton onClick={leaveQueue}>Sair da fila</DangerButton>
              :
              <SuccessButton onClick={enterQueue}>Entrar na fila</SuccessButton>
          }
          { !matchData && <p>Jogadores na fila: {playersData.players!.length}/10</p>}
        </Queue>

        <Profile>
          <a href={accountData?.profileurl} target="_blank" rel="noreferrer">
            <img src={accountData?.avatarmedium} alt={accountData?.personaname} />
            <p>{accountData?.personaname}</p>
          </a>
          <DangerButton onClick={handleLogout}>Sair</DangerButton>
        </Profile>
      </HeaderBar>

      {playersData.isMatchRunning ?
      <p>Existe uma partida em andamento...</p>
      :
      matchData ? 
        <MatchArea>
          <div className="teamA team">
            <h2>{matchData.teamAName}</h2>
            <div className="match-players">
              {matchData?.teamA.map(member => (
                <MatchPlayer key={member.steamid} href={member.profileurl} target="_blank" rel="noreferrer">
                  <img src={member.avatar} alt={member.personaname} />
                  <p>{member.personaname}</p>
                </MatchPlayer>
              ))}
            </div>

          </div>
          <div className="connect">
            <a href={`steam://connect/${process.env.REACT_APP_CSGO_HOST}:${process.env.REACT_APP_CSGO_PORT}`} target="_blank" rel="noreferrer">Entrar na partida</a>
            <p>connect {`${process.env.REACT_APP_CSGO_HOST}:${process.env.REACT_APP_CSGO_PORT}`}</p>
          </div>
          <div className="teamB team">
          <h2>{matchData.teamBName}</h2>
            <div className="match-players">
              {matchData!.teamB.map(member => (
                <MatchPlayer key={member.steamid} href={member.profileurl} target="_blank" rel="noreferrer">
                  <img src={member.avatar} alt={member.personaname} />
                  <p>{member.personaname}</p>
                </MatchPlayer>
              ))}
            </div>
          </div>
        </MatchArea>
        :
        <QueueArea>
          {playersData.players!.map(playerData => (
            <ProfileCard
              key={playerData?.steamid}
              src={playerData?.avatarfull}
              personaname={playerData?.personaname}
              loccountrycode={playerData?.loccountrycode}
              profileurl={playerData?.profileurl}
              selfUser={playerData?.steamid === accountData?.steamid}
            />
          ))}
        </QueueArea>
    }
    </>
  )
}

export default Lobby;
