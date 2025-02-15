import Script from 'next/script';
import NextLink from "next/link";
import Head from 'next/head';
import EmailPasswordAuthNoSSR from './ProtectingRoute';
import React, { ReactNode } from 'react';
import type { ReactElement } from 'react'
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { useRouter } from 'next/router';
import { successAlert } from '../services/alert.service';
import { Logo } from "../components/svg/logo";
import { LogoIcon } from "../components/svg/logoIcon";
import { myColors } from '../theme/theme';
import { useSWRConfig } from 'swr';
import { useUser, LogoutUser } from '../services/users.service';
import { filterNotifications, useNotifications } from '../services/notifications.service';

import {
  extendTheme,
  LinkBox,
  LinkOverlay,
  BoxProps,
  ChakraProvider,
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  FlexProps,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Skeleton,
  Stack,
  Tag,
  TagLabel
} from '@chakra-ui/react';


import {
  FiHome,
  FiHelpCircle,
  FiSettings,
  FiMenu,
  FiUsers,
  FiMousePointer,
  FiLogOut,
  FiAlertCircle,
  FiTwitter,
  FiMail,
  FiSliders
} from 'react-icons/fi';


interface SidebarProps extends BoxProps {
  onClose: () => void;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  href: string;
  text: ReactText;
  notification?: Number;
}

interface NavLinkProps extends NavItemProps {
  color_hover?: string;
}


export function getLayoutDashboard(page: ReactElement) {

  const theme = extendTheme({
    colors: myColors
  })

  return (
    <EmailPasswordAuthNoSSR>
      <ChakraProvider theme={theme}>
        <LayoutDashboard>
          <Script src="https://feedback.fish/ff.js?pid=6c2143ebae3810" />
          <Head>
            <title>lupax.</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          </Head>
          {page}
        </LayoutDashboard>
      </ChakraProvider>
    </EmailPasswordAuthNoSSR>
  )
}

export default function LayoutDashboard({ children }: { children: ReactNode }) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('brand.100', 'gray.900');


  return (
    <Box minH="100vh" bg={bg}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'flex' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} >
        {children}
      </Box>
    </Box>
  );
}



const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

  const { user, isLoading: isLoadingUsers, isError: isErrorUsers } = useUser();
  const { notifications, isLoading: isLoadingNotifications, isError: isErrorNotifications } = useNotifications();

  const bg_color = useColorModeValue('white', 'gray.900');
  const border_color = useColorModeValue('gray.200', 'gray.700');

  const isError = isErrorUsers || isErrorNotifications;
  const isLoading = isLoadingNotifications || isLoadingUsers;


  return (
    <Flex
      bg={bg_color}
      borderRight="1px"
      borderRightColor={border_color}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      direction={'column'}
      justifyContent={'space-between'}
      {...rest}>
      <Flex direction={'column'}>
        <Flex h="20" alignItems="center" mx="8" mb={5} justifyContent="space-between">
          <Logo />
          <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
        </Flex>
        {isLoading &&
          <Stack p={5} spacing={4}>
            <Skeleton height='40px' />
            <Skeleton height='40px' />
            <Skeleton height='40px' />
          </Stack>
        }
        {!isLoading && !isError &&
          <Flex direction={'column'}>
            <NavItem icon={FiHome} href={'/my/dashboard'} text={'Dashboard'} notification={Number(notifications.filter(filterNotifications(user)).length)} />
            <NavItem icon={FiMousePointer} href={'/my/studies'} text={'Studies'} />
            <NavItem icon={FiUsers} href={'/my/teams'} text={'Teams'} />
            {user.role === 'admin' &&
              <NavItem key={'admin'} icon={FiSliders} href={'/my/admin'} text={'Admin'} />
            }
          </Flex>
        }
      </Flex>
      {!isLoading && !isError &&
        <Flex
          direction={'column'}
          mb={5}>
          <NavLink icon={FiSettings} href='/my/settings' text='Settings' />
          <ModalHelp><NavLink icon={FiHelpCircle} href='#help' text='Need Help?' /></ModalHelp>
          <NavLink data-feedback-fish data-feedback-fish-userid={user.email} icon={FiAlertCircle} href='#feedback' text='Give Feddback' />
          <Logout><NavLink icon={FiLogOut} href='#signout' color_hover='red.500' text='Sign out' /></Logout>
        </Flex>
      }
      {isLoading &&
        <Stack p={5} spacing={4}>
          <Skeleton height='22px' />
          <Skeleton height='22px' />
          <Skeleton height='22px' />
          <Skeleton height='22px' />
          {isError &&
            <Logout><NavLink icon={FiLogOut} href='#signout' color_hover='red.500' text='Sign out' /></Logout>
          }
        </Stack>
      }
    </Flex>
  );
};


const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={'space-between'}
      {...rest}>
      <LogoIcon />
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
    </Flex>
  );
};


const NavItem = ({ href, icon, text, notification, ...rest }: NavItemProps) => {
  return (
    <NextLink href={href} passHref>
      <Link style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          _hover={{
            bg: 'green.700',
            color: 'white',
          }}
          {...rest}>
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              _groupHover={{
                color: 'white',
              }}
              as={icon}
            />
          )}
          {text}
          <Flex id={'test'} ml={2}>
            {Number(notification) > 0 &&
              <Tag size='sm' colorScheme='orange' borderRadius='full'>
                <TagLabel>{notification}</TagLabel>
              </Tag>
            }
          </Flex>
        </Flex>
      </Link>
    </NextLink>
  );
};



function NavLink({ icon, href, color_hover = 'gray.800', text, ...rest }: NavLinkProps) {

  return (
    <Box
      px={8}
      py={2}
      color={'gray.500'}
      _hover={{
        color: color_hover,
      }}
      {...rest}>
      <LinkBox>
        <NextLink href={href} passHref>
          <LinkOverlay>
            <Flex alignItems={'center'}>
              <Icon as={icon} mr={3} />
              <Text>{text}</Text>
            </Flex>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
    </Box>
  )
}



function Logout({ children }: { children: ReactElement }) {

  const key_url_api_me = `${process.env.NEXT_PUBLIC_URL_BASE_API}/me/`;
  const router = useRouter();
  const { mutate } = useSWRConfig();

  async function handelLogout() {
  
    if (await LogoutUser() == true) {
      mutate(key_url_api_me)
      router.push('/').then(() => {
        successAlert('', 'Successful logout');
      })
    }
  }

  return (
    <Box onClick={handelLogout}>
      {children}
    </Box>
  )

}



function ModalHelp({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box onClick={onOpen}>
        {children}
      </Box>
      <Modal
        isCentered
        isOpen={isOpen}
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Get support
            <Text fontSize='sm' color='gray.500'>We’re here to help you get the most out of lupax.</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex p={1} mb={1}>
              <LinkBox>
                <LinkOverlay href='mailto:support@lupax.app' isExternal>
                  <Button leftIcon={<Icon as={FiMail} />} colorScheme='teal' variant='ghost'>
                    support@lupax.app
                  </Button>
                </LinkOverlay>
              </LinkBox>
              <LinkBox>
                <LinkOverlay href='https://twitter.com/lupax_app/' isExternal>
                  <Button leftIcon={<Icon as={FiTwitter} />} colorScheme='teal' variant='ghost'>
                    @lupax_app
                  </Button>
                </LinkOverlay>
              </LinkBox>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
