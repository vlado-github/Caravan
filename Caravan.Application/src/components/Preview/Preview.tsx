import type { SocialEventStatus } from '../../api/base/enums/SocialEventStatus';
import type { SocialEventType } from '../../api/base/enums/SocialEventType';
import { DefaultConsts } from '../../consts/DefaultConsts';
import DateTimeDisplay from '../DateTime/DateTimeDisplay';
import styles from './Preview.module.scss';
import { Grid, Image, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type ReactElement } from 'react';
import GroupPreview from './GroupPreview';
import RsvpPreview from './RsvpPreview';

interface PreviewProps{
    event: {
      id: string;
      title: string;
      description: string;
      type: SocialEventType;
      status: SocialEventStatus;
      socialGroupId: string;
      socialGroupName: string;
      isSocialGroupMember: boolean;
      isPrivate: boolean;
      venue: string;
      city: string;
      location: {
        longitude: number;
        latitude: number;
      };
      startTime: Date;
      endTime: Date | null;
      ticketCirculationCount: number;
      imageUrl: string;
      createdById: string;
      createdAt: Date;
      publishedAt: Date | null;
      cancelledAt: Date | null;
      archivedAt: Date | null;
    },
    actions?: ReactElement;
}

const Preview: React.FC<PreviewProps> = ({ event, actions }) => {
  const { t } = useTranslation();

  return (
    <Grid>
      <Grid.Col span={{ base : 12, sm: 6, md: 4, lg: 3 }}>
        <Image
          src={event.imageUrl}
          alt={event.title}
          className={styles.socialEventPreviewImage}
          fallbackSrc={DefaultConsts.PlaceholderImage}
        />
      </Grid.Col>
      <Grid.Col span={{ base : 12, sm: 6, md: 4, lg: 3 }}>
        <Stack>
          <div>
            <h3 className={styles.socialEventPreviewTitle}>{event.title}</h3>
            <div className={styles.socialEventPreviewGroup}>
              <GroupPreview 
                socialGroupId={event.socialGroupId}
                isSocialGroupMember={event.isSocialGroupMember} 
                socialGroupName={event.socialGroupName} />
            </div>
            <p className={styles.socialEventPreviewDescription}>{event.description}</p>
            <p className={styles.socialEventPreviewDate}>
              <DateTimeDisplay label={t("Start time")} dateTime={event.startTime}/>
            </p>
            <p className={styles.socialEventPreviewDate}>
              <DateTimeDisplay label={t("End time")} dateTime={event.endTime}/>
            </p>
            <p className={styles.socialEventPreviewVenue}>{event.venue}, {event.city}</p>
            
          </div>
          <div>
            <RsvpPreview
              socialEventId={event.id}
              title={event.title}
              startTime={event.startTime}
              isAttending={false} />
          </div>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}

export default Preview;
