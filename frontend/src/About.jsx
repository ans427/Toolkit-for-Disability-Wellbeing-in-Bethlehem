import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import './About.css'

function About() {
  return (
    <>
      <main className="container">
        <Breadcrumb />
        <div className="about">
          <header className="about-header">
            <Link to="/" className="back-link">← Back Home</Link>
            <h1>About Us</h1>
          </header>

          <section className="about-section">
            <h2>Why this toolkit?</h2>
            <p>We are a team of disability scholars, researchers, and students who are interested in disability and well-being within urban environments. In 2024, our team began a multi-year pilot project in Bethlehem, Pennsylvania, to identify the access gaps that exist in the city’s built environment, services, infrastructure, and policy, as well as gather the stories of disabled residents, their caregivers, and their loved ones.</p>
            <p>This was done through a series of in-depth, individual interviews, and community mapping workshops. The mapping workshops invited disabled residents and members of their communities to share their experiences of the city, as well as their more immediate environments, such as apartments or homes. The workshops quickly became opportunities to create solidarity and share resources, as disabled residents communicated their needs, difficulties, things that they have found useful, and visions for their lives in Bethlehem. Through these events, it became apparent that there is a distinct lack of accessibility in the city – but additionally, a lack of access to information. This shaped our decision to compile our findings in the form of this toolkit.</p>
            <p>This toolkit is meant to distribute the information that was gathered throughout these workshops, and inform a wider audience of the gaps that must be addressed in Bethlehem. It is not all-encompassing, and we encourage you to leave questions and provide feedback to help us shape this toolkit into a more valuable resource!</p>
          </section>

          <section className="about-section">
            <h2>Who is it for?</h2>
            <p>This toolkit is meant for a range of audiences. It was primarily written and shaped for:</p>
            <ul>
              <li>Disabled residents of Bethlehem.</li>
              <li>Caregivers, loved ones, and neighbors of these disabled residents.</li>
              <li>Community members looking to fill existing resource gaps.</li>
              <li>Any and all residents and policy makers looking to make change.</li>
              <li>Allies looking to learn more.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>How can you use it?</h2>
            <p>The contents of these toolkit, include the following:</p>
            <ol>
              <li>Immediate Resources</li>
              <li>Policy and Service Gaps</li>
              <li>Disability Activism</li>
            </ol>
            <p>The toolkit can be used to:</p>
            <ol>
              <li>Locate resources that you, or someone you know, may be able to take advantage of. Disability resources can be difficult to find, and this toolkit attempts to bridge the divide between what is available, and what residents might be aware of.</li>
              <li>Become informed on the gaps that currently exist in Bethlehem’s policies, services, and infrastructure, so that you are better equipped to make a difference in your community.</li>
              <li>Learn current ideas about disability activism, accessibility, and justice.</li>
              <li>Report inaccessible spaces, dangerous spaces, difficult/faulty resources, abuse, and any other problems you see or experience.</li>
            </ol>
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
