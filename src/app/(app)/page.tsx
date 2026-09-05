const Page = async ({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string[] }>;
}) => {
  return (
    <div>
      <h1>Multi-Tenant Example</h1>
      <p>
        This multi-tenant example allows you to explore multi-tenancy with
        domains and with slugs.
      </p>

      <h2>Domains</h2>
      <p>
        When you visit a tenant by domain, the domain is used to determine the
        tenant.
      </p>
      <p>
        For example, visiting{" "}
        <a href="http://lbdluxe.localhost:3000/tenant-domains/login">test link</a>{" "}
        will show the tenant with the domain &quot;lbdluxe.localhost&quot;.
      </p>

      <h2>Slugs</h2>
      <p>
        When you visit a tenant by slug, the slug is used to determine the
        tenant.
      </p>
      <p>
        For example, visiting{" "}
        <a href="http://localhost:3000/tenant-slugs/lbdluxe/login">
          http://localhost:3000/tenant-slugs/lbdluxe/login
        </a>{" "}
        will show the tenant with the slug &quot;lbdluxe&quot;.
      </p>
    </div>
  );
};

export default Page;
