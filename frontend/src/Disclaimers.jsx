import { Link } from 'react-router-dom'
import './Disclaimers.css'

function Disclaimers() {
  return (
    <main className="container">
      <div className="disclaimers">
        <header className="disclaimers-header">
          <Link to="/" className="back-link">← Back Home</Link>
          <h1>Disclaimers</h1>
        </header>

        <section className="disclaimer-section">
          <h2>General Disclaimer</h2>
          <p>The Toolkit for Disability Wellbeing is provided as an informational resource for the disability community in Bethlehem, PA. While we strive to ensure the accuracy and completeness of all information provided, we make no warranties or representations regarding the content on this website.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Resource Information</h2>
          <p>All resources, services, and organizations listed on this website are provided for informational purposes only. The inclusion of any resource does not constitute an endorsement or recommendation. We encourage users to conduct their own research and verify information before utilizing any listed services.</p>
          <p>Resource information is current as of the date of publication but may change without notice. Please contact each organization directly for the most up-to-date information regarding their services, hours, and availability.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Community Stories</h2>
          <p>Community stories and personal accounts shared on this website reflect the experiences and perspectives of the individuals who submitted them. These stories do not necessarily represent the views or policies of the Toolkit for Disability Wellbeing project or its partners.</p>
          <p>Stories are provided as-is and have been moderated for community guidelines. We do not verify the factual accuracy of individual accounts.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Medical and Legal Advice</h2>
          <p>Information provided on this website should not be considered medical, legal, or professional advice. If you require professional assistance, please consult with qualified healthcare providers, attorneys, or other appropriate professionals.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Accessibility</h2>
          <p>We are committed to ensuring this website is accessible to all users, including people with disabilities. Our accessibility toolbar allows customization of text size, contrast, and other display options. If you experience accessibility barriers, please contact us at info@toolkit-disability-bethlehem.org.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Limitation of Liability</h2>
          <p>In no event shall the Toolkit for Disability Wellbeing, its creators, or contributors be liable for any indirect, incidental, special, or consequential damages arising out of or relating to the use of this website or its content.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Updates and Changes</h2>
          <p>We reserve the right to update, modify, or remove content from this website at any time without notice. Your continued use of the website following such modifications constitutes your acceptance of these changes.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Contact</h2>
          <p>If you have questions about these disclaimers or this website, please contact us:</p>
          <p>Email: <a href="mailto:example@example.org">example@example.org</a></p>
          <p>Phone: (123) 456-7890</p>
        </section>
      </div>
    </main>
  )
}

export default Disclaimers
