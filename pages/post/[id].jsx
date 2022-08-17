import ReactMarkdown from "react-markdown";
import { useRouter } from "next/router";
import Link from "next/link";
import { css } from "@emotion/css";
import { ethers } from "ethers";
import { useAccountContext } from "../../src/context/account";

/* import contract and owner addresses */
import { CONTRACT_ADDRESS, OWNER_ADDRESS } from "../../config";
import Blog from "../../artifacts/contracts/Blog.sol/Blog.json";

const Post = ({ post }) => {
  const { account } = useAccountContext();
  const router = useRouter();
  const { id } = router.query;

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {post && (
        <div className={container}>
          {
            /* if the owner is the user, render an edit button */
            OWNER_ADDRESS === account && (
              <div className={editPost}>
                <Link href={`/edit-post/${id}`}>
                  <a>Edit post</a>
                </Link>
              </div>
            )
          }
          <h1>{post[1]}</h1>
          <div className={contentContainer}>
            <ReactMarkdown>{post[2]}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;

export async function getStaticPaths() {
  /* here we fetch the posts from the network */
  let provider;
  if (process.env.ENVIRONMENT === "local") {
    provider = new ethers.providers.JsonRpcProvider();
  } else if (process.env.ENVIRONMENT === "testnet") {
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  }

  const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider);
  const data = await contract.fetchPosts();

  /* then we map over the posts and create a params object passing */
  /* the id property to getStaticProps which will run for ever post */
  /* in the array and generate a new page */
  const paths = data.map((d) => ({ params: { id: Number(d[0]).toString() } }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;

  /* here we check to see the current environment variable */
  /* and render a provider based on the environment we're in */
  let provider;
  if (process.env.ENVIRONMENT === "local") {
    provider = new ethers.providers.JsonRpcProvider();
  } else if (process.env.ENVIRONMENT === "testnet") {
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  }

  const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider);
  const data = await contract.fetchPost(id);

  return {
    props: {
      post: JSON.parse(JSON.stringify(data)),
    },
  };
}

const editPost = css`
  margin: 20px 0px;
`;

const container = css`
  width: 900px;
  margin: 0 auto;
`;

const contentContainer = css`
  margin-top: 60px;
  padding: 0px 40px;
  border-left: 1px solid #e7e7e7;
  border-right: 1px solid #e7e7e7;
  & img {
    max-width: 900px;
  }
`;
