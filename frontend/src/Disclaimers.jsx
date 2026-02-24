import { Link } from 'react-router-dom'
import Breadcrumb from './Breadcrumb'
import './Disclaimers.css'

function Disclaimers() {
  return (
    <>
      <Breadcrumb />
      <main className="container">
      <div className="disclaimers">
        <header className="disclaimers-header">
          <Link to="/" className="back-link">← Back Home</Link>
          <h1>Disclaimers</h1>
        </header>

        <section className="disclaimer-section">
          <h2>Section One</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Two</h2>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Three</h2>
          <p>Et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
          <p>Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Four</h2>
          <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut quid ex ea commodi consequatur quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Five</h2>
          <p>Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur at vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Six</h2>
          <p>Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae itaque earum rerum hic tenetur.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Seven</h2>
          <p>A sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat sequi nesciunt neque porro quisquam est, qui dolorem ipsum quia dolor sit amet consectetur.</p>
        </section>

        <section className="disclaimer-section">
          <h2>Section Eight</h2>
          <p>Adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam.</p>
        </section>
      </div>
      </main>
    </>
  )
}

export default Disclaimers
