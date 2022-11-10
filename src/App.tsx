import { useEffect, useState } from "react"
import { ButtonPresent } from "./components/ButtonsPresent";

import "./styles.css";

interface attendeeProps {
  name: string,
  email: string,
  checkin_code: number,
}
export function App() {
  const [attendees, setAttendees] = useState([] as attendeeProps[])
  const [termSearch, setTermSearch] = useState("")
  const [loading, setLoading] = useState(true)
  let numShow = 0

  useEffect(() => {
    fetch("https://www.even3.com.br/api/v1/attendees/", {
      headers: {
        "Authorization-Token": "b21206c6-fb42-48d3-8195-32812b59378a"
      }
    }).then(r => r.json()).then(r => {
      const attendeeArray: attendeeProps[] = r.data;
      const attendeesFilter: attendeeProps[] = [];

      attendeeArray.forEach((attendee) => {
        attendeesFilter.push({
          checkin_code: attendee.checkin_code,
          name: attendee.name,
          email: attendee.email,
        })
      })

      setAttendees(attendeesFilter)
      setLoading(false)
    })
  }, [])

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setTermSearch(e.target.value)
  }

  return (
    <>
      <h1>Credenciamento - Semana Preta</h1>
      <input type="text" onChange={handleSearch} placeholder="Pesquise por nome ou email" />
      <div className="table">
        <table>
          <thead>
            <th>Nome</th>
            <th>Email</th>
            <th>16/11</th>
            <th>17/11</th>
          </thead>
          <tbody>
            {loading ?
              <tr>
                <td colSpan={4} style={{
                  textAlign: "center"
                }}>Carregando...</td>
              </tr> :
              attendees.map((attendee, index) => {
                if (numShow < 10) {
                  if (attendee.name.toLowerCase().indexOf(termSearch.toLowerCase()) > -1 || attendee.email.toLowerCase().indexOf(termSearch.toLowerCase()) > -1) {
                    numShow++
                    return (
                      <tr key={index}>
                        <td>{attendee.name}</td>
                        <td>{attendee.email}</td>
                        <td><ButtonPresent checkin_code={attendee.checkin_code} day={16} /></td>
                        <td><ButtonPresent checkin_code={attendee.checkin_code} day={17} /></td>
                      </tr>
                    );
                  }
                }
              })
            }
          </tbody>
        </table>
      </div>
      <footer>
        <p> Desenvolvido por:{" "}
          <a href="https://stagon.in">Stagon</a>
        </p>
      </footer>
    </>
  )
}
