import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { css } from "@emotion/css";
import dynamic from "next/dynamic";
import { ethers } from "ethers";

import { CONTRACT_ADDRESS } from "../../config";
import Blog from "../../artifacts/contracts/Blog.sol/Blog.json";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const EditPost = () => {
  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;
    let provider;
    if (process.env.NEXT_PUBLIC_ENVIRONMENT === "local") {
      provider = new ethers.providers.JsonRpcProvider();
    } else if (process.env.NEXT_PUBLIC_ENVIRONMENT === "testnet") {
      provider = new ethers.providers.JsonRpcProvider(
        "https://rpc-mumbai.matic.today"
      );
    } else {
      provider = new ethers.providers.JsonRpcProvider(
        "https://polygon-rpc.com/"
      );
    }
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, provider);
    const val = await contract.fetchPost(id);

    /* finally we append the post ID to the post data */
    /* we need this ID to make updates to the post */
    setPost(val);
  };

  const updatePost = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, Blog.abi, signer);
    await contract.updatePost(post.id, post.title, post.content, true);
    router.push("/");
  };

  if (!post) return null;

  return (
    <div className={container}>
      {editing && (
        <div>
          <input
            onChange={(e) => setPost({ ...post, title: e.target.value })}
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
          <button className={button} onClick={updatePost}>
            Update post
          </button>
        </div>
      )}
      {!editing && (
        <div>
          {post.coverImagePath && (
            <Image
              alt="cover"
              src={post.coverImagePath}
              className={coverImageStyle}
            />
          )}
          <h1>{post.title}</h1>
          <div className={contentContainer}>
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      )}
      <button
        className={button}
        onClick={() => setEditing(editing ? false : true)}
      >
        {editing ? "View post" : "Edit post"}
      </button>
    </div>
  );
};

export default EditPost;

const button = css`
  background-color: #fafafa;
  outline: none;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 15px;
  font-size: 18px;
  padding: 16px 70px;
  box-shadow: 7px 7px rgba(0, 0, 0, 0.1);
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

const mdEditor = css`
  margin-top: 40px;
`;

const coverImageStyle = css`
  width: 900px;
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
