import React from 'react';
import { NextPage, NextPageContext } from 'next';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import graphql from 'graphql-tag';
import nextCookie from 'next-cookies';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';

import { withAuthSync } from '../../auth/WithAuthSync';
import { Title, PostCard, PostComments, GoBackButton, Space } from '../../ui';
import { labels } from '../../ui/layout';

import { RootState } from '../../store/ducks/rootReducer';
import { withApollo } from '../../apollo/Apollo';
import { KARMA_AUTHOR } from '../../common/config';
import { PostInterface } from '../../ui/post/PostCard';

const Wrapper = styled.div`
  @media (max-width: 700px) {
    padding: 30px 15px 0;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    margin: 0 20px 0 0;
  }

  @media (max-width: 700px) {
    button + div {
      display: none;
    }
  }
`;

const GET_POST = graphql`
  query post($post_id: Int!, $accountname: String) {
    post(post_id: $post_id, accountname: $accountname) @rest(type: "Post", path: "post/{args.post_id}") {
      author
      post_id
      voteStatus(accountname: $accountname)
      author_displayname
      author_profilehash
      imagehashes
      videohashes
      created_at
      description
      upvote_count
      downvote_count
      comment_count
      tip_count
      username
    }
    comments(post_id: $post_id) @rest(type: "Comment", path: "comments/post/{args.post_id}") {
      cmmt_id
      text
      post_id
      author_profilehash
      author
      username
      created_at
    }
  }
`;

interface Props {
  post: PostInterface;
  comments: any[];
}

const Post: NextPage<Props> = ({ post, comments }) => {
  const { avatar } = useSelector((state: RootState) => state.user.profile);

  return (
    <Wrapper>
      <TitleWrapper>
        <GoBackButton href="/home" as="/home" />
        <Title bordered={false}>Post</Title>
      </TitleWrapper>
      <Space height={20} />

      <PostCard post={post} shouldHideFollowOnMobile withFollowButton={false} />

      <PostComments comments={comments} avatar={avatar as string} />
    </Wrapper>
  );
};

interface Context extends NextPageContext {
  query: {
    id: string;
  };
  apolloClient: ApolloClient<NormalizedCacheObject>;
}

Post.getInitialProps = async (ctx: Context) => {
  const cookies = nextCookie(ctx);
  const author = cookies[encodeURIComponent(KARMA_AUTHOR)];

  const { data } = await ctx.apolloClient.query({
    query: GET_POST,
    variables: {
      post_id: ctx.query.id,
      accountname: author,
    },
  });

  return {
    post: data.post,
    comments: data.comments,
    meta: {
      title: `${data.post.author} on Karma "${data.post.description}"`,
      description: data.post.description,
    },
    layoutConfig: {
      layout: labels.DEFAULT,
      shouldHideHeader: true,
    },
  };
};

export default withAuthSync(withApollo({ ssr: true })(Post));
