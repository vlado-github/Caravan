import { DefaultConsts } from '../../consts/DefaultConsts';
import styles from './Gallery.module.scss'
import { Image } from '@mantine/core';

interface GalleryTileProps {
  imageSrc: string;
  title: string;
  description: string;
}

const GalleryTile : React.FC<GalleryTileProps> = ({ imageSrc, title, description }) => {
  
  return (
      <div className={styles.galleryTile}>  
        <Image
          src={imageSrc}
          alt={title}
          className={styles.galleryTileImage}
          fallbackSrc={DefaultConsts.PlaceholderImage}
        />
        <div className={styles.galleryTileContent}>
            <h3 className={styles.galleryTileTitle}>{title}</h3>   
            <p className={styles.galleryTileDescription}>{description}</p>
        </div>
      </div>
  );
} 

export default GalleryTile;