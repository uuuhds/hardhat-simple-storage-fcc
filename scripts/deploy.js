// imports
const { ethers, run, network } = require("hardhat")

// async main
async function main() {
    const factory = await ethers.getContractFactory("SimpleStorage")
    console.log(`Deploy contract ...`)
    const contract = await factory.deploy()
    await contract.deployed()
    console.log("Contract had been deployed at: ", contract.address)
    if (network.config.chainId === 5 && process.env.ETHER_SCAN_API_KEY) {
        console.log("Waiting for block confirmations...")
        await contract.deployTransaction.wait(6)
        await verify(contract.address, [])
    }

    const currentValue = await contract.retrieve()
    console.log(`Current Value is: ${currentValue}`)

    const txResponse = await contract.store(7)
    await txResponse.wait(1)
    const updatedValue = await contract.retrieve()
    console.log(`Update Value is: ${updatedValue}`)
}

async function verify(address, constructorArguments) {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address,
            constructorArguments,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

// main
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
