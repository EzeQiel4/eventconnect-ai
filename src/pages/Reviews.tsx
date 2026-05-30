import { useState } from "react";
import { Star, Camera, Check, Award, ThumbsUp } from "lucide-react";
import { Section, Badge, Card, Button } from "../components/ui";
import { useApp } from "../context/AppContext";

export default function Reviews() {
  const { bookings, reviews, addReview } = useApp();
  const completed = bookings.filter((b) => b.status === "Completed");
  const reviewedIds = new Set(reviews.map((r) => r.bookingId));
  const pending = completed.filter((b) => !reviewedIds.has(b.id));

  const [active, setActive] = useState<string | null>(pending[0]?.id ?? null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState(0);

  const activeBooking = bookings.find((b) => b.id === active);

  const submit = () => {
    if (!activeBooking || rating === 0) return;
    addReview({
      bookingId: activeBooking.id,
      vendorId: activeBooking.vendorId,
      vendorName: activeBooking.vendorName,
      rating,
      title: title || "Great experience",
      body: body || "Wonderful service, highly recommend!",
      photos,
      author: "You",
    });
    setActive(null);
    setRating(0);
    setTitle("");
    setBody("");
    setPhotos(0);
  };

  return (
    <div className="bg-cream pb-16">
      <Section className="pt-10">
        <Badge variant="coral">
          <Award className="h-3 w-3" /> Reviews & ratings
        </Badge>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">Rate your vendors</h1>
        <p className="mt-1 max-w-xl text-ink/60">
          Your honest feedback builds trust and helps other organizers book with confidence.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Pending reviews / form */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl">Awaiting your review</h2>
            {pending.length === 0 && (
              <Card className="p-8 text-center">
                <Check className="mx-auto h-8 w-8 text-sage" />
                <p className="mt-2 text-sm text-ink/60">You've reviewed all completed bookings. Thank you!</p>
              </Card>
            )}
            {pending.map((b) => (
              <Card
                key={b.id}
                className={`cursor-pointer p-5 transition ${active === b.id ? "ring-2 ring-coral" : "hover:border-ink/30"}`}
                onClick={() => setActive(b.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-coral to-amber text-sm font-bold text-white">
                      {b.vendorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{b.vendorName}</div>
                      <div className="text-xs text-ink/50">{b.category} · {b.id}</div>
                    </div>
                  </div>
                  <Badge variant="sage">Completed</Badge>
                </div>

                {active === b.id && (
                  <div className="mt-5 space-y-4 border-t border-ink/10 pt-5" onClick={(e) => e.stopPropagation()}>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-ink/50">Your rating</div>
                      <div className="mt-2 flex gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onMouseEnter={() => setHover(n)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(n)}
                          >
                            <Star
                              className={`h-8 w-8 transition ${
                                n <= (hover || rating) ? "fill-amber text-amber" : "text-ink/20"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Summarize your experience"
                      className="w-full rounded-xl border border-ink/10 bg-cream-2 px-4 py-2.5 text-sm outline-none focus:border-ink"
                    />
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={3}
                      placeholder="Tell others about the quality, communication, and professionalism…"
                      className="w-full rounded-xl border border-ink/10 bg-cream-2 px-4 py-2.5 text-sm outline-none focus:border-ink"
                    />
                    <button
                      onClick={() => setPhotos((p) => p + 1)}
                      className="flex items-center gap-2 rounded-xl border border-dashed border-ink/20 px-4 py-2.5 text-sm text-ink/60 hover:border-ink/40"
                    >
                      <Camera className="h-4 w-4" /> Add event photos {photos > 0 && `(${photos})`}
                    </button>
                    <Button variant="primary" className="w-full" disabled={rating === 0} onClick={submit}>
                      Submit review
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Published reviews */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl">Your published reviews</h2>
            {reviews.length === 0 && (
              <Card className="p-8 text-center text-sm text-ink/60">No reviews yet.</Card>
            )}
            {reviews.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sage to-emerald-400 text-sm font-bold text-white">
                      {r.vendorName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{r.vendorName}</div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star key={n} className={`h-3.5 w-3.5 ${n <= r.rating ? "fill-amber text-amber" : "text-ink/20"}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-ink/40">{r.date}</div>
                </div>
                <h3 className="mt-3 font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{r.body}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-ink/50">
                  {r.photos > 0 && (
                    <span className="flex items-center gap-1">
                      <Camera className="h-3.5 w-3.5" /> {r.photos} photo{r.photos > 1 ? "s" : ""}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" /> Helpful
                  </span>
                  <span>· by {r.author}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
