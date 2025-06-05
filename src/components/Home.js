import React, { useEffect } from 'react'
import axios from 'axios'
import { myBaseUrl } from '../utils/api'

const Home = () => {
  const homeUrl = `${myBaseUrl}/api/home/`

  useEffect(() => {
    axios
      .get(homeUrl, { withCredentials: true })
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <p>This is coming from the home side.</p>
    </div>
  )
}

export default Home
