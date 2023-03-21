import { db } from "@/firebase";
import { User } from "@/helpers/types/types";
import { collection, getDocs } from "firebase/firestore";
import { ref } from "vue";

const users = ref<User[]>([])

export const setUsers = async () => {  
  users.value = []
  const usersRef = collection(db, "users")
  const docSnap = await getDocs(usersRef);
  docSnap.forEach(doc => {
    users.value?.push(doc.data() as User)
  })
}

export const findUser = (q : string) => {
  const foundUsers: User[] | User | undefined = users.value?.filter(user => user.name.toLowerCase().startsWith(q.toLowerCase()))
  
  return foundUsers
}