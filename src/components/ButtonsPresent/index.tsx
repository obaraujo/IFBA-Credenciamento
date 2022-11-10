import { useEffect, useState } from "react"
import "./style.css"

interface buttonProps {
  checkin_code: number
  day: 16 | 17
}

interface event extends React.MouseEvent<HTMLButtonElement> {
  target: React.MouseEvent<HTMLButtonElement>['currentTarget']
}
export function ButtonPresent({ checkin_code, day }: buttonProps) {
  const [isPresent, setIsPresent] = useState(false)

  useEffect(() => {
    const formData = new FormData()
    formData.append("checkin_code", checkin_code.toString())
    formData.append("day_" + day, "")
    fetch("https://stagon.in/semanapreta/", {
      method: "POST",
      body: formData
    }).then(r => r.json()).then(r => {
      setIsPresent(r.state === "1")
    })
  }, [])

  function handleClick(e: event) {
    e.currentTarget.classList.add('loading')
    e.currentTarget.setAttribute('disabled', "true")
    const formData = new FormData()
    formData.append("checkin_code", checkin_code.toString())
    formData.append("day_" + day, isPresent ? "0" : "1")
    fetch("https://stagon.in/semanapreta/", {
      method: "POST",
      body: formData
    }).then(r => r.json()).then(r => {
      const state = r.state
      const attendees = {
        attendees: [{
          checkin_code: checkin_code.toString(),
          checkin: r.days.day_17 === "1" && r.days.day_16 === "1" ? 1 : 0,
          checkin_date: new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0]
        }]
      }

      fetch("https://www.even3.com.br/api/v1/checkin/attendees/", {
        method: "POST",
        body: JSON.stringify(attendees),
        headers: {
          "Content-Type": "application/json",
          "Authorization-Token": "b21206c6-fb42-48d3-8195-32812b59378a"
        }
      }).then(r => {
        setIsPresent(state === "1")
        e.target.classList.remove('loading')
        e.target.removeAttribute('disabled')
      })
    })
  }

  const today = new Date();

  return (
    <button
      className={isPresent ? "yes" : "no"}
      // disabled={!(today.getDate() === day)}
      onClick={handleClick}>
      {isPresent ? "Presente ✅" : "Ausente 🤔"}
    </button>
  )
}