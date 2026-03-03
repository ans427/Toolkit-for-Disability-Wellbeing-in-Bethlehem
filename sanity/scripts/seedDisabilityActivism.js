/**
 * Seed script for Disability Activism page content.
 * Run: cd sanity && SANITY_TOKEN=your_token node scripts/seedDisabilityActivism.js
 *
 * Or with dotenv: create .env.local with SANITY_TOKEN=...
 */

const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: 'bfuuhtl6',
  dataset: 'production',
  apiVersion: '2026-02-05',
  useCdn: false,
  token: process.env.SANITY_TOKEN || process.env.SANITY_STUDIO_TOKEN,
})

const document = {
  _id: 'disabilityActivismPage',
  _type: 'disabilityActivismPage',
  pageTitle: 'Disability Activism',
  subtitle: 'Current Terms, Activism, and Questions',
  intro: `This section is an introduction to some of the ways that we have tried to define and wrestle with the complexities of disability – as well as understandings that can help us work toward justice for disabled people. While the concepts that it discusses have each created progress within these conversations, ideas about disability are constantly expanding to include new perspectives, tensions, questions, and goals. The aim of the following entries is to describe, but in some cases critique, the way that disability is discussed today. Throughout your reading, we hope to convey how ideas related to disability often contain meanings beyond what is obvious or expected – reflecting their particular historical contexts, and the larger frameworks that shape our everyday lives.

This approach does not just allow a deeper understanding of disability – it makes clear that when we talk about the obstacles of disabled life, we reveal significant gaps in all of our everyday structures. These gaps are not exceptions. While they create significant barriers for disabled people, they also demonstrate how things like a lack of resources, flexibility, and understanding show up in all of our lives. Disability helps us ask: what else is possible? How can we create a more caring society? How can everyone live more freely? This section will not be able to fully answer these questions – but we hope that it prompts your own investigations into how disabled perspectives can point to the possibility of new and more just ways of living.`,
  sections: [
    {
      _type: 'section',
      _key: 'defining-disability',
      title: 'Defining Disability',
      content: `When reviewing each of the topics addressed below, one of the most important things to remember is that disability is not necessarily a stable category. As will be discussed later, the identity of disability contains particular political advantages, allowing disabled people to name a shared experience and to engage in collective activism. But many disabilities look and feel different on a daily basis, or are experienced differently in different spaces. Various types of disability have been transformed throughout history, changing in how they are experienced because of shifts in the ways that we work and live. A lot of people are not born with their disabilities, and the majority of people will begin to experience disability as they grow older. Disability is infinitely complex, and practicing ways to behold and handle its complexities is a key aspect of working toward disability justice.`,
    },
    {
      _type: 'section',
      _key: 'social-model',
      title: 'Understanding the Social Model',
      content: `Disability involves considerations beyond just the body or the mind. More recent models for defining disability, most prominently the "social model," think about disability as something that is created by a person's environment. The "social model" asserts how physical, sensory, cognitive, or other human differences only become "disabling" when they are met with a social/physical world that was not built for them. Thinking about disability in this way challenges prior models, primarily the "medical model," that hold disability as "defective" – something that, because it does not conform to what might be considered "normal" mobility, behavior, or perception, is a medical problem to be solved, rather than a variation to be accommodated. Among other concerns, the medical model, and similar ideas, ignore how our ideas about what is "normal" only become clear when we have ideas about what is "abnormal" – resulting in very narrow constraints for how people are permitted to move, look, and feel.`,
    },
    {
      _type: 'section',
      _key: 'beyond-social-model',
      title: 'Beyond the Social Model',
      content: `The "social model" is useful because it allows us to begin questioning the obstacles that could be removed from our social and physical environments – and the many ways that we could expand our rules, our designs, and our expectations in order to dismantle structures that value some bodies and minds more than others.

But while these environmental aspects do have a profound effect on what is defined and experienced as a disability, thinking beyond the social model involves reintroducing the body – its experiences and sensations – as a topic of concern. For example, how would the social model apply to someone whose disability involves daily physical pain? Or someone whose experience of the world is affected by a difficult mental health condition? In a culture where disability is often positioned in a negative light, the social model, by saying that all experiences of disability can be relieved by addressing our environments, becomes in some cases just a different way that we try to "solve" disabled life. Rather, what would the world look like if we created the time and the space for pain? And cared for one another in a way that can acknowledge difficulty – without pity, devaluation, or blame? These are complex questions that have just started to be answered by disability movements, but that regardless, create a path toward models for disability that can incorporate the recognition of struggle, alongside the recognition of disabled joy and thriving.`,
    },
    {
      _type: 'section',
      _key: 'political-identity',
      title: 'Disability as a Political Identity',
      content: `Although it is an unstable category that seems to span an infinite variety of conditions and experiences, "disabled" is also an identity that can be used to establish a shared interest in certain steps for social/political change. While the activism of disabled people often varies greatly, according to different disabilities, goals, and strategies, the label of "disability" frequently serves as a touchstone for the collective action and the self-organization of disabled people. Organizing under the label of disability positions disabled people as having the most expertise regarding their lives, and generates the collective power that is needed to fight for change. Additionally, within the label of disability, individuals can build solidarity, engage in forms of "disability culture," or otherwise reclaim disability as a source of community and knowledge.

A sense of cross-disability consciousness first emerged out of disabled involvement in other movements, such as civil rights, Black Power, and the women's movements of the 1960s and 70s. The most current perspectives in disability activism ask: What does it really mean to have a cross-disability consciousness? How do we make sure that our strategies incorporate agency for people of all types of disabilities, and other marginalized identities? How do we create a nuanced dialogue around disability, and all of the identities that it may intersect with? How do we create an access landscape where we aren't just provided access to the "mainstream," but are actively working to change the "mainstream" structures that uphold ableism?`,
    },
    {
      _type: 'section',
      _key: 'disability-justice-movement',
      title: 'The Disability Justice Movement',
      content: `Many of our most current ideas concerning disability and disability activism, some of which have already been discussed, come from the work of the disability justice movement. "Disability justice," is a specific activist framework that emerged in recent history in order to engage in disability activism beyond prior goals of independence of individual rights. The movement was established by the original Disability Justice Collective, founded in 2005 by Patty Berne, Mia Mingus, Stacey Milbern, Leroy Moore, Eli Clare, and Sebastian Margaret. The tenets of disability justice are best understood by reading the "Ten Principles of Disability Justice," written by the disabled performance/activist collective Sins Invalid – but overall, the disability justice movement is a cross-disability movement that centers interdependence, collective responsibility, and a deeply nuanced understanding of disability in relationship with identities such as gender, sexual orientation, race, class, immigration status or nation of origin, etc.

Some of the movement's core ideas are introduced in more detail throughout the following entries, but the overall objectives of disability justice can be summarized through the words of Mia Mingus: "a model of disability that embraces difference, confronts privilege and challenges what is considered 'normal' on every front. We don't want to simply join the ranks of the privileged; we want to dismantle those ranks and the systems that maintain them."`,
    },
    {
      _type: 'section',
      _key: 'defining-accessibility',
      title: 'Defining Accessibility',
      content: `Original uses of the term "access" in relationship with disability were rooted in a sense of civil rights, citizenship, and core American rights. Advocates of the 1960s and 1970s argued for accessibility as a matter of disabled people receiving equal protection under the law, and unconfined freedom of mobility. Access is also often understood in the terms of the laws that were passed in or after this time period, such as the Architectural Barriers Act of 1968, the Rehabilitation Act of 1973, or most famously, the American with Disabilities Act of 1990 (the ADA). The technological and architectural mandates that came from these pieces of legislation were strongly attached to the "social model" for disability, understanding disability as, at least in part, as a product of environmental barriers rather than an individual deficit. Despite the existence of these laws, architectural accessibility remains an ongoing struggle, as gaps in attention and implementation still frequently appear in our spaces/cities.

Although these previous efforts have resulted in immense progress for disabled communities, the disability justice movement holds an updated vision of what accessibility could mean. In the words of Mia Mingus, speaking in 2018: "I don't just want technical and logistical access. I don't just want inclusion, I want liberatory access . . ." By "liberatory access," Mingus is naming a version of accessibility that refuses to treat disability as a singular or isolated issue. Liberatory accessibility does not just grant "access" to conversations, but creates its own conversation: recognizing the wholeness of all people, regardless of difference, engaging with issues of ableism in all of their complexity, and identifying the stakes of disability justice in relationship with other movements. It also resists the tendency to treat accessibility as a matter of personal "independence" – asserting, instead, that true accessibility will come from our ability to rely on and acknowledge the ways that we all already rely on each other.`,
    },
    {
      _type: 'section',
      _key: 'beyond-universal-design',
      title: 'Beyond Universal Design',
      content: `In light of these newer understandings of accessibility, and some of the complex definitions of disability that were outlined above, what does an accessible world look like? How are we able to adequately meet everyone's needs?

Ideas of "universal design" are often posed as the answer to these questions. As per their title, the principles of universal design are intended to establish guidelines for architectures, infrastructures, and products that can work for everyone "universally." However, like many of the concepts that have been described so far, "universal design" contains its own drawbacks and hidden meanings. For example, Aimi Hamrai, in Building Access: Universal Design and the Politics of Disability, writes that by ignoring concerns such as financial accessibility, the principles of universal design can exclude the critique of systems and larger structures held by frameworks such as disability justice. And, as in our previous discussion about the "social model," it can easily become a way that society attempts to "solve" disability, emphasizing equal participation and independence, rather than a nuanced understanding of difficulty, wholeness, and interdependence. Regardless, ideas about universal design serve as a testament to the idea that design can be open-ended, flexible, work for a variety of users, and explicitly value the experience of disabled users.

In the last chapter of Building Access, Aimi Hamrai proposes that "critical universal design" will be essential for creating more comprehensive meanings for accessibility. Drawing from the framework of disability justice, Hamrai writes that thinking of universal access in the terms of intersectional justice allows us to consider who we are talking about when we say that we are designing for "everyone," and how we can establish accountability for truly equitable and accessible futures.`,
    },
    {
      _type: 'section',
      _key: 'independence-interdependence',
      title: 'Independence vs. Interdependence',
      content: '',
    },
    {
      _type: 'section',
      _key: 'intersectional-perspectives',
      title: 'Intersectional Perspectives',
      content: '',
    },
    {
      _type: 'section',
      _key: 'non-disabled-allyship',
      title: 'Non-Disabled Allyship for Disability Justice',
      content: '',
    },
  ],
  principlesSection: {
    intro: 'Shortened for clarity/approachability',
    principles: [
      { _type: 'object', _key: 'p1', number: 1, title: 'Intersectionality', description: 'People have multiple identities, and are shaped by both privilege and oppression.' },
      { _type: 'object', _key: 'p2', number: 2, title: 'Leadership of Those Most Impacted', description: 'We must be led by those who know the most about oppressive systems.' },
      { _type: 'object', _key: 'p3', number: 3, title: 'Anti-Capitalist Politic', description: 'We do not believe human worth is defined by the ability to work.' },
      { _type: 'object', _key: 'p4', number: 4, title: 'Cross-Movement Solidarity', description: 'Disability Justice shifts how social justice movements understand disability/ableism.' },
      { _type: 'object', _key: 'p5', number: 5, title: 'Recognizing Wholeness', description: 'Disabled people are whole people – valued as they are, and for who they are.' },
      { _type: 'object', _key: 'p6', number: 6, title: 'Sustainability', description: 'We pace ourselves to be sustained long-term, valuing the teachings of our lives/bodies.' },
      { _type: 'object', _key: 'p7', number: 7, title: 'Commitment to Cross-Disability Solidarity', description: 'We value and honor the participation of all of our community members.' },
      { _type: 'object', _key: 'p8', number: 8, title: 'Interdependence', description: "We all share one planet – we attempt to meet each other's needs, and build liberation." },
      { _type: 'object', _key: 'p9', number: 9, title: 'Collective Access', description: "We share responsibility for our access needs." },
      { _type: 'object', _key: 'p10', number: 10, title: 'Collective Liberation', description: 'How do we move together as people, where no body/mind is left behind?' },
    ],
  },
  externalLinks: [
    { _type: 'object', _key: 'l1', url: 'https://www.jstor.org/stable/48828313?seq=17', label: 'JSTOR Article' },
    { _type: 'object', _key: 'l2', url: 'https://ebookcentral-proquest-com.bard.idm.oclc.org/lib/bard/reader.action?docID=29288675&c=UERG&ppg=156#', label: 'ProQuest Ebook' },
    { _type: 'object', _key: 'l3', url: 'https://leavingevidence.wordpress.com/2011/07/26/edges/', label: 'Leaving Evidence: Edges' },
    { _type: 'object', _key: 'l4', url: 'https://leavingevidence.wordpress.com/2017/08/06/forced-intimacy-an-ableist-norm/', label: 'Leaving Evidence: Forced Intimacy' },
  ],
  sources: [
    { _type: 'object', _key: 's1', text: 'Care Work: Dreaming Disability Justice' },
    { _type: 'object', _key: 's2', text: 'Keywords for Disability Studies' },
    { _type: 'object', _key: 's3', text: 'Dis/Entangling Critical Disability Studies' },
    { _type: 'object', _key: 's4', text: 'The Bodymind Problem and the Possibilities of Pain' },
    { _type: 'object', _key: 's5', text: 'From Social Constructionism to the New Realism of the Body' },
    { _type: 'object', _key: 's6', text: 'DISABILITY, IDENTITY AND DIFFERENCE' },
    { _type: 'object', _key: 's7', text: 'The Ten Principles of Disability Justice' },
    { _type: 'object', _key: 's8', text: 'Stimpunks Foundation - Disability Justice' },
    { _type: 'object', _key: 's9', text: 'Disability Justice Blog', url: 'https://disabilityj.blogspot.com/' },
    { _type: 'object', _key: 's10', text: '"Disability Justice" Is Simply Another Term for Love' },
    { _type: 'object', _key: 's11', text: 'Changing the Framework: Disability Justice' },
    { _type: 'object', _key: 's12', text: 'Origins of the ADA', url: 'https://acl.gov/ada/origins-of-the-ada' },
    { _type: 'object', _key: 's13', text: 'The 7 Principles of Universal Design', url: 'https://universaldesign.ie/about-universal-design/the-7-principles' },
    { _type: 'object', _key: 's14', text: 'Building Access' },
  ],
}

async function seed() {
  if (!client.config().token) {
    console.error('Error: SANITY_TOKEN or SANITY_STUDIO_TOKEN environment variable is required.')
    process.exit(1)
  }

  try {
    await client.createOrReplace(document)
    console.log('✓ Disability Activism page content seeded successfully.')
    console.log('  Remember to publish the document in Sanity Studio to make it live.')
  } catch (err) {
    console.error('Error seeding content:', err.message)
    if (err.message?.includes('Insufficient permissions')) {
      console.error('  Make sure your token has write access to the dataset.')
    }
    if (err.message?.includes('unknown type') || err.message?.includes('disabilityActivismPage')) {
      console.error('  Deploy the schema first: npx sanity schema deploy')
    }
    process.exit(1)
  }
}

seed()
