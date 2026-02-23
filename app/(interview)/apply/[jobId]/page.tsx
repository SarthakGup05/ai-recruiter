export default function ApplyPage({
    params,
}: {
    params: { jobId: string };
}) {
    return <div>Apply for Job: {params.jobId}</div>;
}
