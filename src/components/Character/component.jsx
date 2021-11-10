import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { usePollValue } from "../../hooks/usePollValue";
import { mq } from "../../common/mq";
import { Link } from "@mui/material";
import { useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { addSpawnListener } from "../../common/mq";
import { removeSpawnListener } from "../../common/mq";

export const Character = () => {
  const targetName = usePollValue(() => mq.tlo.Target.Name());
  const link = targetName
    ? `https://eq.magelo.com/do_npcs.jspa?name=${targetName
        .split(" ")
        .join(
          "_"
        )}&zone=${mq.tlo.Zone.ID()}&expansion=&minLevel=1&maxLevel=200&raceBodyId=0`
    : "";
  const { addToast } = useToasts();
  useEffect(() => {
    const listener = (spawn) => {
      addToast(`Mob spawned: ${spawn} :  ${spawn?.displayedName}`, { appearance: "info" });
      };
    addSpawnListener(listener);
    return () => {
      removeSpawnListener(listener)
    }
  }, [addToast]);
  return (
    <Box className="content-card" sx={{ minWidth: 275 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Character: {mq.tlo.Me.Name}
          </Typography>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            Target:
            {targetName && <Link href={link}>{targetName || "No Target"}</Link>}
          </Typography>
          {targetName && (
            <>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                Dynamic View
              </Typography>
              <iframe title={'Dynamic NPC'} src={link} width={600} height={300} />
            </>
          )}
        </CardContent>
        <CardActions></CardActions>
      </Card>
    </Box>
  );
};
