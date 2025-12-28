import { DefaultConsts } from '../../consts/DefaultConsts';
import styles from './Gallery.module.scss'
import { Card, Image } from '@mantine/core';

interface GalleryTileProps {
  imageSrc: string;
  title: string;
  description: string;
  maxDescriptionLength: number;
  onClick: () => void;
}

const GalleryTile : React.FC<GalleryTileProps> = ({ onClick, imageSrc, title, description, maxDescriptionLength }) => {
  const moreDetails = description.length > maxDescriptionLength ? '...' : '';
  
  return (
    <Card className={styles.galleryTile} onClick={onClick}>  
      <Image
        src={imageSrc}
        alt={title}
        className={styles.galleryTileImage}
        fallbackSrc={DefaultConsts.PlaceholderImage}
      />
      <div className={styles.galleryTileContent}>
          <h3 className={styles.galleryTileTitle}>{title}</h3>   
          <p className={styles.galleryTileDescription}>{`${description.substring(0, maxDescriptionLength)}${moreDetails}`}</p>
      </div>
    </Card >
  );
} 

export default GalleryTile;