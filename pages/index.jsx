import { css } from "@emotion/css";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import Link from "next/link";

import { CONTRACT_ADDRESS, OWNER_ADDRESS } from "../config";

/* import Application Binary Interface (ABI) */
import Blog from "../artifacts/contracts/Blog.sol/Blog.json";
import { useAccountContext } from "../src/context/account";

const Home = (props) => {
  const { posts } = props;
  const { account } = useAccountContext();

  const router = useRouter();

  const navigate = () => {
    router.push("/create-post");
  };

  return (
    <div>
      <div className={postList}>
        {posts.map((post, index) => (
          <Link href={`/post/${Number(post[0].hex)}`} key={index}>
            <a>
              <div className={linkStyle}>
                <p className={postTitle}>{post[1]}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
      <div className={container}>
        {account === OWNER_ADDRESS && posts && posts.length === 0 && (
          /* if the signed in user is the account owner, render a button */
          /* to create the first post */
          <button className={buttonStyle} onClick={navigate}>
            Create your first post
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;

export async function getServerSideProps() {
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
  const data = await contract.fetchPosts();

  return {
    props: {
      posts: JSON.parse(JSON.stringify(data)),
    },
  };
}

const postTitle = css`
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
  margin: 0;
  padding: 20px;
`;

const linkStyle = css`
  border: 1px solid #ddd;
  margin-top: 20px;
  border-radius: 8px;
  display: flex;
`;

const postList = css`
  width: 700px;
  margin: 0 auto;
  padding-top: 50px;
`;

const container = css`
  display: flex;
  justify-content: center;
`;

const buttonStyle = css`
  margin-top: 100px;
  background-color: #fafafa;
  outline: none;
  border: none;
  font-size: 44px;
  padding: 20px 70px;
  border-radius: 15px;
  cursor: pointer;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;
