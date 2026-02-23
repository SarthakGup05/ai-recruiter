export default function InterviewRoomPage({
    params,
}: {
    params: { token: string };
}) {
    return <div>Interview Room: {params.token}</div>;
}
