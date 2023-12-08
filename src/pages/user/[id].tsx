import { useRouter } from "next/router";
import { api } from "~/utils/api";
import Image from "next/image";

export default function UserProfile() {
  let { id } = useRouter().query;
  if (Array.isArray(id)) {
    id = id[0];
  }

  const { data: user, isLoading } = api.users.getUser.useQuery({
    userId: id ?? "",
  });

  //check
  if (isLoading) return <div>loading...</div>;
  if (!user && !isLoading) return <div>user not found: redirect</div>;

  return (
    <div className="border-2">
      <div className="flex">
        <Image
          src={`${user?.image}`}
          alt="Imagen de usuario"
          height={100}
          width={100}
        />
      </div>
    </div>
  );
}
