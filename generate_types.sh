# check if .env file exists
if [ ! -f .env ]; then
  echo "Can't read .env file to retrieve project ID. (Does it exist?)"
  exit 1
fi

# read the .env file and extract the project id
export PROJECT_ID=$(cat .env | grep NEXT_PUBLIC_SUPABASE_URL | sed 's/NEXT_PUBLIC_SUPABASE_URL=//g' | sed 's/https:\/\///g' | sed 's/.supabase.co//g' | xargs)
echo "Generating types for project $PROJECT_ID"

# generate the types
npx supabase gen types typescript --project-id $PROJECT_ID --schema public > util/supabase/types.ts
echo "Successfully generated types. Saved to [util/supabase/types.ts]"