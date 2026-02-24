import { Link } from 'react-router-dom'
import { GrPlayFill } from "react-icons/gr"
import { TbWorldShare } from "react-icons/tb"
import { LuArrowUpRight } from "react-icons/lu"
import { MdNavigateNext } from "react-icons/md"
import { TypeAnimation } from 'react-type-animation'
import './homepage.css'

const Homepage = () => {
   
/*const test = async () => {
  await fetch("http://localhost:5000/api/test", {
      credentials: "include",
    });
  };*/
    

  return (
    <div className="homepage">

      <img
        src="commetdesign.svg"
        width="100%"
        height="100%"
        className="design"
      />

      <div className="left">

        <div className="meta">
          <h6>November 30, 2025</h6>
          <p>Product</p>
        </div>

        <h1>Introducing AMC</h1>
        <h2 className="h2tag">Assistant</h2>

        <h3 className="quote">
          “Where curiosity meets intelligent conversation.”
        </h3>

        <div className="actions">

          <button className="primary-btn">
            <Link to="/dashboard">
              Try Assistant <LuArrowUpRight />
            </Link>
          </button>

        {/* <button onClick={test}>TEST BACKEND AUTH</button> */}

          <p className="secondary-link">
            Try Assistant for Work <MdNavigateNext />
          </p>

        </div>

        {/* bottom bar */}
        <div className="bottom-bar">

          <div className="play-btn">
            <GrPlayFill />
          </div>

          <a href="https://americancollege.edu.in/">
            <div className="share-btn">
              <span>Visit </span>
              <TbWorldShare />
            </div>
          </a>

        </div>
      </div>

      <div className="right">

        <img src="clg.jpg" alt="" className="clgimg" />

        <div className="chat">

          <img src="amclogo2.JPG" alt="" />

          <TypeAnimation
            sequence={[
              'Campus Intelligence, delivered Instantly',
              1000,
              'Campus Intelligence, delivered Precisely',
              1000,
              'Campus Intelligence, delivered Seamlessly',
              1000,
              'Campus Intelligence, delivered Intelligently...',
              1000,
            ]}
            wrapper="span"
            speed={50}
            style={{ fontSize: '2em', display: 'inline-block' }}
            repeat={Infinity}
            cursor={true}
          />

        </div>
        
      </div>

    </div>
  )
}

export default Homepage
