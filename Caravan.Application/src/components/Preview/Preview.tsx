import type { SocialEventStatus } from '../../api/base/enums/SocialEventStatus';
import type { SocialEventType } from '../../api/base/enums/SocialEventType';
import { DefaultConsts } from '../../consts/DefaultConsts';
import styles from './Preview.module.css';
import { Image } from '@mantine/core';

interface PreviewProps{
    event: {
      id: string;
      title: string;
      description: string;
      type: SocialEventType;
      status: SocialEventStatus;
      isProvate: boolean;
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
    }
}

const Preview: React.FC<PreviewProps> = ({ event }) => {
  return (
      <div className={styles.socialEventPreview}>     
        <Image
          src={event.imageUrl}
          alt={event.title}
          className={styles.socialEventPreviewImage}
          fallbackSrc={DefaultConsts.PlaceholderImage}
        />
        <div className={styles.socialEventPreviewContent}>
            <h3 className={styles.socialEventPreviewTitle}>{event.title}</h3>
            <p className={styles.socialEventPreviewDescription}>{event.description}</p>
            <p className={styles.socialEventPreviewDate}>{new Date(event.startTime).toLocaleDateString()}</p>
            { event.endTime != null ? <p className={styles.socialEventPreviewDate}>{new Date(event.endTime).toLocaleDateString()}</p> : null }
        </div>
      </div>
  );
}

export default Preview;