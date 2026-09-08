import Link from 'next/link'

const Page = async () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: 640 }}>
      <h1>Lbdluxe CMS</h1>
      <p>This CMS manages content for the Lbdluxe website.</p>
      <ul>
        <li>
          <Link href="/admin">Admin</Link>
        </li>
        <li>
          <Link href="/api/graphql">GraphQL</Link>
        </li>
      </ul>
    </div>
  )
}

export default Page