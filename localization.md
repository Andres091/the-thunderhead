# How to Translate

If you're reading this, you either stumbled upon it, or want to help translate The Thunderhead bot. In either case, keep on reading.


## msgs.json

The file [`msgs.json`](https://github.com/humboldt123/the-thunderhead/blob/master/static/msgs.json) in The Thunderhead's code has all the messages that need to be localized. It is located in the [`static`](https://github.com/humboldt123/the-thunderhead/tree/master/static) folder on the bot's [GitHub](https://github.com/humboldt123/the-thunderhead). 

## Pre-Prep

Okay! Now that you have navigated to the file and made a GitHub account; what do you do? Well, its simple. Figure out which language you want to translate for. If the language you want is not available, then [write a suggestion](https://github.com/humboldt123/the-thunderhead/issues/new?assignees=humboldt123&labels=enhancement&template=feature_request.md&title=%5BFEATURE%20REQUEST%5D) and it will be added shortly.

## Prep

Find the language code for which language you want. If you aren't sure, look at the aliases:

```json
{
"en": {
"aliases": ["English", "Inglés", "Anglais"],
"flag": "🇬🇧"
}
```
As you can see; English has the language code of `en`. The aliases and flag should have already been done for you so now we're ready!

## Syntax

If you haven't already noticed; [`msgs.json`](https://github.com/humboldt123/the-thunderhead/blob/master/static/msgs.json) uses the [JSON](https://www.w3schools.com/js/js_json_syntax.asp) syntax (obviously). Additionally, you may have noticed text in all capital letters encased in square brackets. Lets call these `[Variables]`.  While you may already know what variables are; for the sake of translation lets say they are just placeholder text that the bot scans for and replaces with the proper text. For example, in this line:
```json
"coinflip_success": "The coin landed on [ITEM]. [@USER] won [AMOUNT] [CURRENCY]!",
```
The `[Variable]` `[@USER]` will be replaced with @-ing the user who won the coinflip and the `[Variable]``[CURRENCY]` will be replaced with the vibes emoji.

### Syntax tl;dr
```json
"do_not_change_text_here": "[DO] [NOT] Change text here!",
```
Do **not** change or add `[Variables]` (the all caps text in square brackets). Do **not** change text in the quotes before the parenthesis. Do **not** add quotation marks. **Do** translate the text after the `: "` and before the `",` on each line.
```json
"do_not_change_text_here": "[DO] [NOT] changer le texte ici",
```
# Let's-a-Go!

For the sake of this Example, let's say you were translating for the French Language.  Navigate to the line with its language code by searching for it with `Control + F`. 
You should see a line of text that looks like this `"fr": {`.  

## Translation
Now the easy (if you know the language you're translating for (which you should) (and also English)) part. Just translate. Make sure to change this line `"completion":"0.1",` to however much you got done. It does not have to be the *exact* percent. Just your best estimate.

# Submit a PR
Now that its done, or partially done; what do you do?
- Click the green **Propose File Change** button.
- [Optional] Write a description of what you changed
- Click the green **Create Pull Request** button
- Click the green **Create Pull Request** button (again)
- It should be reviewed and approved soon.
