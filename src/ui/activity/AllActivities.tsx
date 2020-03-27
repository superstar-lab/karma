import React from 'react';
import styled, { css } from 'styled-components';

import heart from '../assets/green-heart.svg';
import comment from '../assets/activity-comment.svg';
import tip from '../assets/tip-big.png';
import recycled from '../assets/recycled.svg';
import sent from '../assets/karmas.png';

import ActivityItem from './ActivityItem';

const Container = styled.div`
  > strong {
    font-size: 26px;
    font-weight: 900;
    color: #fff;
  }

  @media (max-width: 550px) {
    > strong {
      display: none;
    }
  }
`;

const greenText = css`
  color: ${p => p.theme.green};
`;

interface Props {
  data: {
    sender: string;
    trx_id: string;
    receiver: string;
    action: string;
    data: string;
    memo: string;
    sender_displayname: string;
    receiver_displayname: string;
    receiver_profile_hash: any;
    sender_profile_hash: string;
    post_image_hashes: any;
    post_video_hashes: any;
    created_at: string;
    username: string;
    __typename: string;
  }[];
}

const AllActivities: React.FC<Props> = ({ data }) => {
  return (
    <Container>
      <strong>Recent</strong>

      {data.map((item, index) => {
        switch (item.action) {
          case 'Upvote':
            return (
              <ActivityItem
                key={index}
                icon={heart}
                avatar={item.sender_profile_hash}
                author={item.sender_displayname}
                action="liked your post:"
                date={item.created_at}
                post={item.post_image_hashes ? item.post_image_hashes[0] : undefined}
              />
            );
          case 'Createcmmt':
            return (
              <ActivityItem
                key={index}
                icon={comment}
                avatar={item.sender_profile_hash}
                author={item.sender_displayname}
                action="commented on your post:"
                post={item.post_image_hashes ? item.post_image_hashes[0] : undefined}
                date={item.created_at}
              />
            );
          case 'tip':
            return (
              <ActivityItem
                key={index}
                icon={tip}
                avatar={item.sender_profile_hash}
                author={item.sender_displayname}
                action="tipped you:"
                post={item.post_image_hashes ? item.post_image_hashes[0] : undefined}
                date={item.created_at}
                content={item.data}
                contentCss={greenText}
              />
            );
          case 'recycle':
            return (
              <ActivityItem
                key={index}
                icon={recycled}
                avatar={item.sender_profile_hash}
                author={item.sender_displayname}
                action="recycled your post:"
                date={item.created_at}
                post={item.post_image_hashes ? item.post_image_hashes[0] : undefined}
                content={`"${item.data}"`}
              />
            );
          case 'Transfer':
            return (
              <ActivityItem
                key={index}
                icon={sent}
                avatar={item.sender_profile_hash}
                author={item.sender_displayname}
                action="sent you:"
                date={item.created_at}
                content={item.data}
                contentCss={greenText}
              />
            );
          default:
            return null;
        }
      })}
    </Container>
  );
};

export default AllActivities;
