import dbConnect from '../lib/mongodb';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function main() {
  const email = process.env.SUPERUSER_EMAIL;
  const password = process.env.SUPERUSER_PASSWORD;
  const name = process.env.SUPERUSER_NAME;

  if (!email || !password || !name) {
    console.error('❌ Erro: SUPERUSER_EMAIL, SUPERUSER_PASSWORD e SUPERUSER_NAME devem estar no .env.local');
    process.exit(1);
  }

  await dbConnect();

  const existing = await User.findOne({ role: 'superuser' });
  if (existing) {
    console.log(`⚠️  Aviso: Já existe um superuser cadastrado (${existing.email}). Abortando.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const superuser = new User({
    email,
    password: hashedPassword,
    name,
    role: 'superuser',
    createdBy: 'system'
  });

  await superuser.save();

  console.log(`✅ Superuser criado com sucesso: ${email}`);
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Erro inesperado:', error);
  process.exit(1);
});
