import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import './About.css'

function About() {
  return (
    <>
      <Breadcrumb />
      <main className="container">
        <div className="about">
          <header className="about-header">
            <Link to="/" className="back-link">← Back Home</Link>
            <h1>About Us</h1>
          </header>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>The Toolkit for Disability Wellbeing is a community-driven initiative dedicated to supporting disabled residents in Bethlehem, PA through accessible resources, shared experiences, and collaborative advocacy for disability justice.</p>
          </section>

          <section className="about-section">
            <h2>What We Do</h2>
            <p>We provide a comprehensive platform that connects disabled individuals with immediate resources including healthcare, legal services, housing assistance, and community support. Our toolkit also features lived experiences from community members and highlights systemic gaps in local policies and services.</p>
            <p>By amplifying the voices and experiences of disabled residents, we aim to create a more inclusive and accessible Bethlehem for everyone.</p>
          </section>

          <section className="about-section">
            <h2>Community-Driven Approach</h2>
            <p>This toolkit grows through community contribution. We believe that the people most affected by accessibility barriers are experts in identifying solutions. We welcome feedback, resource suggestions, community stories, and insights from residents about local accessibility challenges.</p>
          </section>

          <section className="about-section">
            <h2>Accessibility Commitment</h2>
            <p>We are committed to making this toolkit as accessible as possible for people with all types of disabilities. Our site includes customizable accessibility features such as adjustable text size, high contrast mode, dyslexia-friendly fonts, reduced animations, and increased spacing. Please refer to our <Link to="/accessibility-statement" className="inline-link">Accessibility Statement</Link> for more information.</p>
          </section>

          <section className="about-section">
            <h2>Get Involved</h2>
            <p>Whether you want to share a resource, tell your story, report an accessibility barrier, or offer other feedback—we want to hear from you. <Link to="/submit" className="inline-link">Submit a Resource or Story</Link> to contribute to the toolkit and help us build a more accessible Bethlehem.</p>
          </section>

          <section className="about-section about-contact">
            <h2>Contact Us</h2>
            <p>Email: <a href="mailto:example@example.org">example@example.org</a></p>
            <p>Community feedback helps us grow and improve. We look forward to connecting with you.</p>
          </section>
        </div>
      </main>
    </>
  )
}

export default About
