import { AppDataSource } from "../config/configDb.js";
import { User } from "../entities/user.entity.js";
import bcrypt from "bcrypt";

const userRepository = AppDataSource.getRepository(User);

export async function createUser(data) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const newUser = userRepository.create({
    email: data.email,
    password: hashedPassword,
  });

  return await userRepository.save(newUser);
}

export async function findUserByEmail(email) {
  return await userRepository.findOneBy({ email });
}
//funcion patch
export async function updateUserProfile(userId, { email, password }) {
  //Buscar usuario
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("Usuario no encontrado");

  //cambiar email
  if (email) {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser && existingUser.id !== userId) {
      throw new Error("El email ya está en uso");
    }
    user.email = email;
  }

  //cambiar contraseña
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  //guardar
  return await userRepository.save(user);
}

//funcion eliminar
export async function deleteUserAccount(userId) {
  //Buscar usuario
  const user = await userRepository.findOneBy({ id: userId });
  if (!user) throw new Error("Usuario no encontrado");

  //Eliminar usuario
  await userRepository.remove(user);
}