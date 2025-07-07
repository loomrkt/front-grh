interface BlogParams {
  params: {
    slug: string;
  };
}

export default async function BlogPost({ params }: BlogParams) {
  return <h1>Article : {params.slug}</h1>;
}
