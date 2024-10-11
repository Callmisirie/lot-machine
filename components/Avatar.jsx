import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

export function AvatarProfile({imgSrc, initName}) {
  return (
    <Avatar>
      <AvatarImage src={imgSrc} alt="profile image"/>
      <AvatarFallback>{initName}</AvatarFallback>
    </Avatar>
  )
}
