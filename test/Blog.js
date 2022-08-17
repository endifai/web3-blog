const { expect } = require("chai");
const { ethers } = require("hardhat");

const getBlog = async () => {
  const Blog = await ethers.getContractFactory("Blog");
  const blog = await Blog.deploy("New Blog");
  await blog.deployed();

  return blog;
};

describe("Blog", async () => {
  it("Should create post", async () => {
    const blog = await getBlog();
    await blog.createPost("First post", "Content of first post");

    const posts = await blog.fetchPosts();
    expect(posts[0].content).to.equal("Content of first post");
  });

  it("Should update post", async () => {
    const blog = await getBlog();
    await blog.createPost("Test post", "Some content");

    await blog.updatePost(1, "New title of post", "Some content", false);

    const posts = await blog.fetchPosts();

    expect(posts[0].title).to.equal("New title of post");
    expect(posts[0].published).to.equal(false);
  });

  it("Should change blog name", async () => {
    const blog = await getBlog();

    expect(await blog.name()).to.equals("New Blog");

    await blog.updateBlogName("New name of blog");

    expect(await blog.name()).to.equals("New name of blog");
  });
});
