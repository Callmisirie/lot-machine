export const splitValue = (value) => {
  let split = value
  if (split?.length > 12) {  
    split = split?.slice(0, 12)
    split = split + "..."
    return split
  }
  return split
}