import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { css } from "@emotion/css";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS } from "../config";

import Blog from "../artifacts/contracts/Blog.sol/Blog.json";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const initialState = { title: "", content: "" };

const CreatePost = () => {
  /* configure initial state to be used in the component */
  const [post, setPost] = useState(initialState);
  const [loaded, setLoaded] = useState(false);

  const { title, content } = post;
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      /* delay rendering buttons until dynamic import is complete */
      setLoaded(true);
    }, 500);
  }, []);

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function createNewPost() {
    if (!title || !content) return;
    await savePost();
    router.push(`/`);
  }

  async function savePost() {
    /* anchor post to smart contract */
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, signer);
      console.log("contract: ", contract);
      try {
        const val = await contract.createPost(post.title, post.content);
        console.log("val: ", val);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  return (
    <div className={container}>
      <input
        onChange={onChange}
        name="title"
        placeholder="Give it a title ..."
        value={post.title}
        className={titleStyle}
      />
      <SimpleMDE
        className={mdEditor}
        placeholder="What's on your mind?"
        value={post.content}
        onChange={(value) => setPost({ ...post, content: value })}
      />
      {loaded && (
        <>
          <button className={button} type="button" onClick={createNewPost}>
            Publish
          </button>
        </>
      )}
    </div>
  );
}

const mdEditor = css`
  margin-top: 40px;
`;

const titleStyle = css`
  margin-top: 40px;
  border: none;
  outline: none;
  background-color: inherit;
  font-size: 44px;
  font-weight: 600;
  &::placeholder {
    color: #999999;
  }
`;

const container = css`
  width: 800px;
  margin: 0 auto;
`;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
`;

export default CreatePost;
