import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    Stack,
    Typography,
} from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import MusicNoteOutlinedIcon from "@mui/icons-material/MusicNoteOutlined";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    body: string;
}

function FeatureCard({ icon, title, body }: FeatureCardProps) {
    return (
        <Card variant="outlined" sx={{ width: "100%" }}>
            <CardContent>
                <Stack spacing={1.5} sx={{ alignItems: "flex-start" }}>
                    <Box sx={{ color: "primary.main", display: "flex" }}>{icon}</Box>
                    <Typography variant="subtitle1">{title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {body}
                    </Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

interface WelcomeScreenProps {
    open: boolean;
    onContinue: () => void;
}

export function WelcomeScreen({ open, onContinue }: WelcomeScreenProps) {
    return (
        <Dialog
            open={open}
            fullScreen
            slotProps={{ paper: { sx: { bgcolor: "background.default" } } }}
        >
            <Box
                sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: { xs: 3, sm: 6 },
                }}
            >
                <Stack
                    spacing={4}
                    sx={{
                        alignItems: "center",
                        width: "100%",
                        maxWidth: 560,
                        textAlign: "center",
                    }}
                >
                    <Stack spacing={1} sx={{ alignItems: "center" }}>
                        <Typography variant="h2" color="primary" sx={{ fontWeight: 300 }}>
                            Muse
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                            Your muse, your music.
                        </Typography>
                    </Stack>

                    <Stack spacing={2} sx={{ width: "100%" }}>
                        <FeatureCard
                            icon={<MusicNoteOutlinedIcon fontSize="large" />}
                            title="Generate lyrics from an idea"
                            body="Describe a feeling, a scene, or a theme — Muse turns it into Suno-ready lyrics and style prompts."
                        />
                        <FeatureCard
                            icon={<AutoAwesomeOutlinedIcon fontSize="large" />}
                            title="Pick any genre or vibe"
                            body="Pop, electronic, classical, or blends — Muse shapes the output around what you want it to sound like."
                        />
                        <FeatureCard
                            icon={<BrushOutlinedIcon fontSize="large" />}
                            title="Get matching album art"
                            body="One click turns your song into a cover image — cinematic, styled to match your lyrics."
                        />
                    </Stack>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={onContinue}
                        sx={{ minWidth: 200, minHeight: 48 }}
                    >
                        Get started
                    </Button>
                </Stack>
            </Box>
        </Dialog>
    );
}
