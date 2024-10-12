import { createFrames, Button } from "frames.js/next";
import { farcasterHubContext } from "frames.js/middleware";
import { voter } from "../voter";
import { diamond } from "../diamond";
import { bonus } from "../bonus";

function findVoterByUsername(username: any) {
  return voter.find((user) => user.username === username) || null;
}

function findDiamondByUsername(username: any) {
  return diamond.find((user) => user.username === username) || null;
}

function findBonusByUsername(username: any) {
  return bonus.find((user) => user.username === username) || null;
}

const frames = createFrames({
  basePath: '/frames',
  middleware: [
    farcasterHubContext({
      ...(process.env.NODE_ENV === "production"
        ? {}
        : {
          hubHttpUrl: "http://localhost:3010/hub",
        }),
    }),
  ],
});

const handleRequest = frames(async (ctx) => {
  const searchValue = ctx.message?.inputText || "";
  const lowerCaseSearchValue = searchValue.toLowerCase();
  const voterData = findVoterByUsername(lowerCaseSearchValue);
  const diamondData = findDiamondByUsername(lowerCaseSearchValue);
  const bonusData = findBonusByUsername(lowerCaseSearchValue);

  

  let isInputVisible = !ctx.url.searchParams.has("inputHidden");
  let isBackgroundChanged = ctx.url.searchParams.has("backgroundChanged");

  // Eğer "Back" butonuna tıklanmışsa, ctx.message'yi boş yapıyoruz
  if (ctx.url.searchParams.has("back")) {
    return {
      title: "",
      imageOptions: { aspectRatio: "1:1" },
      image: (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            minWidth: "100vw",
            background: isBackgroundChanged 
            ? "url('https://r.resimlink.com/Lym9szOj.png')" // Yeni arka plan resmi
            : "url('https://r.resimlink.com/JgsoLNyC4Hr.png')", // İlk arka plan resmi

          }}
        >
  
        </div>
      ),
      textInput: "Enter a username!", // Başlangıç durumuna döner
      buttons: [
        <Button action="post" target={{ pathname: "/", query: { inputHidden: "false", backgroundChanged: "false" } }}>
          Check SBTs
        </Button>
      ],
    };
  }

  return {
    imageOptions: { aspectRatio: "1:1" },
    image: (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          minWidth: "100vw",
          background: isBackgroundChanged 
            ? "url('https://r.resimlink.com/Lym9szOj.png')" // Yeni arka plan resmi
            : "url('https://r.resimlink.com/JgsoLNyC4Hr.png')", // İlk arka plan resmi
  
        }}
      >
        {ctx.message ? (
  <div style={{ 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    fontFamily: "Helvetica, Arial, sans-serif", 
    backgroundColor: "rgba(0, 0, 0, 0.7)", 
    padding: "30px", 
    borderRadius: "25px", 
    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)"
  }}>
    <h2 style={{ 
      color: "#ffffff", 
      fontSize: "100px", 
      fontWeight: "bold", 
      marginBottom: "25px",
      marginTop: "25px" 
    }}>
      {searchValue}
    </h2>

    <h3 style={{
      color: "#ffffff", 
      fontSize: "35px", 
      fontWeight: "bold", 
      fontFamily: "Helvetica, Arial, sans-serif", 
      padding: "10px 20px", 
      textAlign: "center", 
      backgroundColor: voterData?.username ? "#aa9dcd" : "#e4908f",
      borderRadius: "8px", 
    }}>
      Voter SBT: &nbsp;{voterData?.username ? "Eligible" : "Not eligible"}
    </h3>


    <h3 style={{
      color: "#ffffff", 
      fontSize: "35px", 
      fontWeight: "bold", 
      fontFamily: "Helvetica, Arial, sans-serif", 
      padding: "10px 15px", 
      textAlign: "center", 
      backgroundColor: diamondData?.diamondOrPaper === "diamond hand" ? "#aa9dcd" : "#e4908f",
      borderRadius: "8px", 
      marginTop: "5px"
    }}>
      Diamond Hand SBT: &nbsp;  {diamondData?.diamondOrPaper === "diamond hand" ? "Eligible" : "Not Eligible"}
    </h3>
    

   
    <h3 style={{
      color: "#ffffff", 
      fontSize: "35px", 
      fontWeight: "bold", 
      fontFamily: "Helvetica, Arial, sans-serif", 
      padding: "10px 20px", 
      textAlign: "center", 
      backgroundColor: bonusData?.username  ? "#aa9dcd" : "#e4908f",
      borderRadius: "8px",
      marginTop: "5px"
    }}>
     First Week 15% Bonus:&nbsp;&nbsp;{bonusData?.username ? "Eligible" : "Not Eligible"}
    </h3>
    
  </div>
) : null }

      </div>
    ),
    textInput: isInputVisible ? "Enter a username!" : undefined,
    buttons: [
      isInputVisible ? (
        <Button action="post" target={{ pathname: "/", query: { inputHidden: "true", backgroundChanged: "true", } }}>
          Check SBTs
        </Button>
      ) : (
        <Button action="post" target={{ pathname: "/", query: { back: "true", } }}>
          ← Back
        </Button>
      )
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
