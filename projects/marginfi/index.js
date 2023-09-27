const { Program } = require("@project-serum/anchor");
const { getProvider, sumTokens2, getConnection, } = require("../helper/solana");
const { PublicKey } = require("@solana/web3.js");

const idl = require('./idl')

async function tvl() {
  // mrgnlend
  const provider = getProvider()
  const program = new Program(idl, 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA', provider)
  const banks = await program.account.bank.all()

  const tvl = sumTokens2({ tokenAccounts: banks.map(i => i.account.liquidityVault.toString()) });

  // LST
  const connection = getConnection();
  const account = await connection.getAccountInfo(new PublicKey('DqhH94PjkZsjAqEze2BEkWhFQJ6EyU6MdtMphMgnXqeK'));
  const lstTvlSolana = Number(account.data.readBigUint64LE(258))/1e9;

  if (!tvl.solana) {
    tvl.solana = 0;
  }

  tvl.solana += lstTvlSolana;
  
  return tvl
}

module.exports = {
  timetravel: false,
  solana: { tvl, },
}
