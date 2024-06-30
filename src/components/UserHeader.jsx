// import { Avatar } from "@chakra-ui/avatar";
// import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
// import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
// import { Portal } from "@chakra-ui/portal";
// import { Button, useToast } from "@chakra-ui/react";
// import { BsInstagram } from "react-icons/bs";
// import { SiGithub, SiCodeforces, SiCodechef, SiLeetcode } from "react-icons/si";
// import { FaCode } from "react-icons/fa"
// import { CgMoreO } from "react-icons/cg";
// import { useRecoilValue } from "recoil";
// import userAtom from "../atoms/userAtom";
// import { Link as RouterLink } from "react-router-dom";
// import useFollowUnfollow from "../hooks/useFollowUnfollow";

// const UserHeader = ({ user }) => {
// 	const toast = useToast();
// 	const currentUser = useRecoilValue(userAtom); // logged in user
// 	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

// 	const copyURL = () => {
// 		const currentURL = window.location.href;
// 		navigator.clipboard.writeText(currentURL).then(() => {
// 			toast({
// 				title: "Success.",
// 				status: "success",
// 				description: "Profile link copied.",
// 				duration: 3000,
// 				isClosable: true,
// 			});
// 		});
// 	};

// 	return (
// 		<VStack gap={4} alignItems={"start"}>
// 			<Flex justifyContent={"space-between"} w={"full"}>
// 				<Box>
// 					<Text fontSize={"2xl"} fontWeight={"bold"}>
// 						{user.name}
// 					</Text>
// 					<Flex gap={2} alignItems={"center"}>
// 						<Text fontSize={"sm"}>{user.username}</Text>
// 						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
// 							threads.net
// 						</Text>
// 					</Flex>
// 				</Box>
// 				<Box>
// 					{user.profilePic && (
// 						<Avatar
// 							name={user.name}
// 							src={user.profilePic}
// 							size={{
// 								base: "md",
// 								md: "xl",
// 							}}
// 						/>
// 					)}
// 					{!user.profilePic && (
// 						<Avatar
// 							name={user.name}
// 							src='https://bit.ly/broken-link'
// 							size={{
// 								base: "md",
// 								md: "xl",
// 							}}
// 						/>
// 					)}
// 				</Box>
// 			</Flex>

// 			<Text>{user.bio}</Text>

// 			{currentUser?._id === user._id && (
// 				<Link as={RouterLink} to='/update'>
// 					<Button size={"sm"}>Update Profile</Button>
// 				</Link>
// 			)}
// 			{currentUser?._id !== user._id && (
// 				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
// 					{following ? "Unfollow" : "Follow"}
// 				</Button>
// 			)}
// 			<Flex w={"full"} justifyContent={"space-between"}>
// 				<Flex gap={2} alignItems={"center"}>
// 					<Text color={"gray.light"}>{user.followers.length} followers</Text>
// 					{/* <Box w='1' h='1' bg={"gray.light"} borderRadius={"full"}></Box> */}
// 					{/* <Link color={"gray.light"}>instagram.com</Link> */}
// 				</Flex>
// 				<Flex>
// 					<Box className='icon-container'>
// 						<SiCodeforces size={24} cursor={"pointer"} />
// 					</Box>
// 					<Box className='icon-container'>
// 						<Menu>
// 							<MenuButton>
// 								<CgMoreO size={24} cursor={"pointer"} />
// 							</MenuButton>
// 							<Portal>
// 								<MenuList bg={"gray.dark"}>
// 									<MenuItem bg={"gray.dark"} onClick={`https://codeforces.com/profile/${user.codeforcesid}`}>
// 										Copy link
// 									</MenuItem>
// 								</MenuList>
// 							</Portal>
// 						</Menu>
// 					</Box>
// 					<Box className='icon-container'>
// 						<Menu>
// 							<MenuButton>
// 								<CgMoreO size={24} cursor={"pointer"} />
// 							</MenuButton>
// 							<Portal>
// 								<MenuList bg={"gray.dark"}>
// 									<MenuItem bg={"gray.dark"} onClick={copyURL}>
// 										Copy link
// 									</MenuItem>
// 								</MenuList>
// 							</Portal>
// 						</Menu>
// 					</Box>
// 					<Box className='icon-container'>
// 						<Menu>
// 							<MenuButton>
// 								<CgMoreO size={24} cursor={"pointer"} />
// 							</MenuButton>
// 							<Portal>
// 								<MenuList bg={"gray.dark"}>
// 									<MenuItem bg={"gray.dark"} onClick={copyURL}>
// 										Copy link
// 									</MenuItem>
// 								</MenuList>
// 							</Portal>
// 						</Menu>
// 					</Box>
// 				</Flex>
// 			</Flex>

// 			<Flex w={"full"}>
// 				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
// 					<Text fontWeight={"bold"}> Threads</Text>
// 				</Flex>
// 				<Flex
// 					flex={1}
// 					borderBottom={"1px solid gray"}
// 					justifyContent={"center"}
// 					color={"gray.light"}
// 					pb='3'
// 					cursor={"pointer"}
// 				>
// 					<Text fontWeight={"bold"}> Replies</Text>
// 				</Flex>
// 			</Flex>
// 		</VStack>
// 	);
// };

// export default UserHeader;

import { Avatar } from "@chakra-ui/avatar";
import { Box, Flex, Link, Text, VStack } from "@chakra-ui/layout";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { Portal } from "@chakra-ui/portal";
import { Button, useToast } from "@chakra-ui/react";
import { SiGithub, SiCodeforces, SiCodechef, SiLeetcode } from "react-icons/si";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const UserHeader = ({ user }) => {
	const toast = useToast();
	const currentUser = useRecoilValue(userAtom); // logged in user
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	const copyURL = () => {
		const currentURL = window.location.href;
		navigator.clipboard.writeText(currentURL).then(() => {
			toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
		});
	};

	return (
		<VStack gap={4} alignItems={"start"}>
			<Flex justifyContent={"space-between"} w={"full"}>
				<Box>
					<Text fontSize={"2xl"} fontWeight={"bold"}>
						{user.name}
					</Text>
					<Flex gap={2} alignItems={"center"}>
						<Text fontSize={"sm"}>{user.username}</Text>
						<Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>
							ZCoder
						</Text>
					</Flex>
				</Box>
				<Box>
					{user.profilePic && (
						<Avatar
							name={user.name}
							src={user.profilePic}
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
					{!user.profilePic && (
						<Avatar
							name={user.name}
							src='https://bit.ly/broken-link'
							size={{
								base: "md",
								md: "xl",
							}}
						/>
					)}
				</Box>
			</Flex>

			<Text>{user.bio}</Text>

			{currentUser?._id === user._id && (
				<Link as={RouterLink} to='/update'>
					<Button size={"sm"}>Update Profile</Button>
				</Link>
			)}
			{currentUser?._id !== user._id && (
				<Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
					{following ? "Unfollow" : "Follow"}
				</Button>
			)}

			<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
				<Flex gap={2} alignItems={"center"}>
					<Text color={"gray.light"}>{user.followers.length} followers</Text>
				</Flex>
				<Flex>
					<Box className='icon-container'>
						<Menu>
							<MenuButton>
								<CgMoreO size={24} cursor={"pointer"} />
							</MenuButton>
							<Portal>
								<MenuList bg={"gray.dark"}>
									<MenuItem bg={"gray.dark"} onClick={copyURL}>
										Copy link
									</MenuItem>
								</MenuList>
							</Portal>
						</Menu>
					</Box>
				</Flex>
			</Flex>

			<Flex gap={4}>
				{user.githubid && (
					<Link href={`https://github.com/${user.githubid}`} isExternal>
						<SiGithub size={24} cursor={"pointer"} />
					</Link>
				)}
				{user.leetcodeid && (
					<Link href={`https://leetcode.com/${user.leetcodeid}`} isExternal>
						<SiLeetcode size={24} cursor={"pointer"} />
					</Link>
				)}
				{user.codeforcesid && (
					<Link href={`https://codeforces.com/profile/${user.codeforcesid}`} isExternal>
						<SiCodeforces size={24} cursor={"pointer"} />
					</Link>
				)}
				{user.codechefid && (
					<Link href={`https://www.codechef.com/users/${user.codechefid}`} isExternal>
						<SiCodechef size={24} cursor={"pointer"} />
					</Link>
				)}
			</Flex>

			<Flex w={"full"}>
				<Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
					<Text fontWeight={"bold"}>ZCoder</Text>
				</Flex>
				<Flex
					flex={1}
					borderBottom={"1px solid gray"}
					justifyContent={"center"}
					color={"gray.light"}
					pb='3'
					cursor={"pointer"}
				>
					<Text fontWeight={"bold"}>Replies</Text>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default UserHeader;
