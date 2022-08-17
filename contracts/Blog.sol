// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Blog {
    string public name;
    address public owner;

    using Counters for Counters.Counter;
    Counters.Counter private _postIds;

    struct Post {
        uint256 id;
        string title;
        string content;
        bool published;
    }

    mapping(uint256 => Post) private idToPost;

    event PostCreated(uint256 id, string title, string content);
    event PostUpdated(uint256 id, string title, string content, bool published);

    constructor(string memory _name) {
        console.log("Deploying blog:", _name);
        name = _name;
        owner = msg.sender;
    }

    // метод для обновления названия блога
    function updateBlogName(string memory _name) public {
        name = _name;
    }

    // метод для смены владельца блога
    function transferBlog(address newAddress) public onlyOwner {
        owner = newAddress;
    }

    // метод для получения поста
    function fetchPost(uint256 id) public view returns (Post memory) {
        return idToPost[id];
    }

    // метод для создания поста
    function createPost(string memory title, string memory content)
        public
        onlyOwner
    {
        _postIds.increment();
        uint256 postId = _postIds.current();

        Post storage post = idToPost[postId];
        post.id = postId;
        post.title = title;
        post.published = true;
        post.content = content;
        idToPost[postId] = post;

        emit PostCreated(postId, title, content);
    }

    // метод для обновления поста
    function updatePost(
        uint256 id,
        string memory title,
        string memory content,
        bool published
    ) public onlyOwner {
        Post storage post = idToPost[id];
        post.title = title;
        post.content = content;
        post.published = published;

        idToPost[id] = post;

        emit PostUpdated(id, title, content, published);
    }

    // метод для получения всех постов
    function fetchPosts() public view returns (Post[] memory) {
        uint256 count = _postIds.current();

        Post[] memory posts = new Post[](count);

        for (uint256 i = 0; i < count; i++) {
            uint256 currentId = i + 1;
            posts[i] = idToPost[currentId];
        }

        return posts;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}
