import React from 'react';
import { Center, Box } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const Footer : React.FC = () => {
    const {t} = useTranslation();
    return (
      <Center className='min-h-4'>
        <Box>{new Date().getFullYear()} Caravan {t("sample")}.</Box>
      </Center>);
}

export default Footer;